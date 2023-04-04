import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat, Conversation } from "../../models";
import axios from '../../axiosInstance';
import { RootState } from "../../app/store";

export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface ChatState {
  chats: { [id: string]: Chat };
  chatsStatus: LoadingStatus;
  selectedConversation: Conversation | null;
  selectedConversationStatus: LoadingStatus;
  isAssistantResponding: boolean;
  autoReplyWithSpeech: boolean;
}

const initialState: ChatState = {
  chats: {},
  chatsStatus: 'idle',
  selectedConversation: null,
  selectedConversationStatus: 'idle',
  isAssistantResponding: false,
  autoReplyWithSpeech: false,
};

/**
 * Fetches all chats
 * @param size - number of chats to fetch
 */
export const fetchChats = createAsyncThunk('chat/fetchChats', async ({
                                                                       page = 0,
                                                                       size = 20,
                                                                     }: { page?: number, size?: number } = {}) => {
  try {
    const response = await axios.get<Chat[]>('/chats', {
      params: {
        page,
        size,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch chats');
  }
});

/**
 * Fetches a chat conversation by id
 * @param chatId - id of the chat conversation to fetch
 * @param currentNode - id of the node to start from (it can be a leaf or a branch)
 * @param upperLimit - number of nodes to fetch above the currentNode (until the root)
 * @param lowerLimit - number of nodes to fetch below the currentNode (the latest child is preferred unless it is a leaf)
 */
export const fetchConversationByChatId = createAsyncThunk(
  'chat/fetchConversationByChatId',
  async ({
           chatId,
           currentNode = undefined,
           upperLimit = undefined,
           lowerLimit = undefined
         }: { chatId: string; currentNode?: string; upperLimit?: number, lowerLimit?: number }) => {
    const response = await axios.get<Conversation>(`/chats/${chatId}/conversation`, {
      params: {
        currentNode,
        upperLimit,
        lowerLimit
      },
    });
    return response.data;
  }
);

/**
 * Updates the content of a node in the chat. Once the node is updated, all children of the node are deleted.
 * @param chatId - id of the chat to update the node in
 * @param nodeId - id of the node to update
 * @param newContent - new content of the node
 */
export const updateConversationMessageContent = createAsyncThunk(
  'chat/updateConversationMessageContent',
  async ({chatId, nodeId, newContent}: { chatId: string; nodeId: string; newContent: string }) => {
    const response = await axios.patch<Conversation>(`/chats/${chatId}/conversation`, {
      content: newContent
    }, {
      params: {
        nodeId
      }
    });
    return response.data;
  }
);

/**
 * Creates a new node in the chat
 * @param chatId - id of the chat to add the node to
 * @param nodeId - id of the node to add the new node to (parent of future node)
 * @param newMessage - content of the new node
 */
export const postNewMessageToConversation = createAsyncThunk(
  'chat/postNewMessageToConversation',
  async ({chatId, newMessage}: { chatId: string; newMessage: string }, {dispatch}) => {
    const response = await axios.post<Conversation>(`/chats/${chatId}/conversation`, {
      content: newMessage,
    });
    return response.data;
  }
);

export const regenerateResponse = createAsyncThunk(
  'chat/regenerateResponse',
  async ({chatId}: { chatId: string; }) => {
    const response = await axios.post<Conversation>(`/chats/${chatId}/conversation/regenerated-response`);
    return response.data;
  }
);

export const stopGenerating = createAsyncThunk(
  'chat/stopGenerating',
  async ({chatId}: { chatId: string; }) => {
    await axios.post<void>(`/chats/${chatId}/conversation/stop-response-generating`);
  }
);

export const deleteChat = createAsyncThunk(
  'chat/deleteChat',
  async (chatId: string) => {
    await axios.delete(`/chats/${chatId}`);
    return chatId;
  }
);

export const deleteAllChats = createAsyncThunk(
  'chat/deleteAllChats',
  async () => {
    await axios.delete('/chats');
  }
);

export const updateChatTitle = createAsyncThunk(
  'chat/updateChatTitle',
  async ({chatId, newTitle}: { chatId: string; newTitle: string }) => {
    const response = await axios.patch(`/chats/${chatId}`, {title: newTitle});
    return {chatId, newTitle: response.data.title};
  }
);

export const createChat = createAsyncThunk(
  'chat/createChat',
  async () => {
    const response = await axios.post('/chats', {
      title: 'New Chat',
    });
    return response.data;
  }
);

function updateStateWithConversationDiff(state: ChatState, conversation: Conversation) {
  if (!state.selectedConversation) {
    return;
  }

  if (state.selectedConversation.id !== conversation.id) {
    console.error('Chat id does not match the selected chat id');
    return;
  }

  state.selectedConversation.currentNode = conversation.currentNode;
  state.selectedConversation.title = conversation.title;

  Object.entries(conversation.mapping).forEach(([nodeId, node]) => {
    state.selectedConversation!.mapping[nodeId] = node;
  });
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    resetSelectedChatStatus: (state) => {
      state.selectedConversationStatus = 'idle';
    },
    addChatNodeContent: (state, action: PayloadAction<Conversation>) => {
      const conversation = action.payload;

      state.isAssistantResponding = true;
      updateStateWithConversationDiff(state, conversation);

      const currentNodeId = conversation.currentNode;
      const currentNode = conversation.mapping[currentNodeId];
      if (currentNode && currentNode.message.content.final) {
        state.isAssistantResponding = false;
      }
    },
    changeReplyWithSpeech: (state, action: PayloadAction<boolean>) => {
      state.autoReplyWithSpeech = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.chatsStatus = 'loading';
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        const chats: Chat[] = action.payload;

        state.chatsStatus = 'succeeded';
        state.chats = chats.reduce((acc, chat) => ({
          ...acc,
          [chat.id]: chat
        }), {});
      })
      .addCase(fetchChats.rejected, (state) => {
        state.chatsStatus = 'failed';
      })
      .addCase(fetchConversationByChatId.pending, (state) => {
        state.selectedConversationStatus = 'loading';
      })
      .addCase(fetchConversationByChatId.fulfilled, (state, action) => {
        const conversation = action.payload;

        state.selectedConversationStatus = 'succeeded';

        if (!state.selectedConversation || state.selectedConversation.id !== conversation.id) {
          state.selectedConversation = conversation;
        } else {
          updateStateWithConversationDiff(state, conversation);
        }
      })
      .addCase(fetchConversationByChatId.rejected, (state) => {
        state.selectedConversationStatus = 'failed';
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        const chatId = action.payload;

        delete state.chats[chatId];

        if (state.selectedConversation && state.selectedConversation.id === chatId) {
          state.selectedConversation = null;
        }
      })
      .addCase(deleteAllChats.fulfilled, (state) => {
        state.chats = {};
        state.selectedConversation = null;
      })
      .addCase(updateChatTitle.fulfilled, (state, action) => {
        const {chatId, newTitle} = action.payload;
        if (state.chats[chatId]) {
          state.chats[chatId].title = newTitle;
        }
      })
      .addCase(createChat.fulfilled, (state, action) => {
        const newChat = action.payload;
        state.chats[newChat.id] = newChat;
      })
      .addCase(updateConversationMessageContent.pending, (state, action) => {
        state.isAssistantResponding = true;
      })
      .addCase(updateConversationMessageContent.fulfilled, (state, action) => {
        updateStateWithConversationDiff(state, action.payload);
      })
      .addCase(postNewMessageToConversation.pending, (state, action) => {
        state.isAssistantResponding = true;
      })
      .addCase(postNewMessageToConversation.fulfilled, (state, action) => {
        updateStateWithConversationDiff(state, action.payload);
      })
      .addCase(regenerateResponse.pending, (state, action) => {
        state.isAssistantResponding = true;
      })
      .addCase(regenerateResponse.fulfilled, (state, action) => {
        state.isAssistantResponding = false;

        updateStateWithConversationDiff(state, action.payload);
      })
      .addCase(stopGenerating.pending, (state) => {
        state.isAssistantResponding = true;
      })
      .addCase(stopGenerating.fulfilled, (state) => {
        state.isAssistantResponding = false;
      })
  }
});

export const selectChats = (state: RootState) => state.chat.chats;
export const selectChatsStatus = (state: RootState) => state.chat.chatsStatus;
export const selectSelectedConversationStatus = (state: RootState) => state.chat.selectedConversationStatus;
export const selectIsAssistantResponding = (state: RootState) => state.chat.isAssistantResponding;
export const selectSelectedConversation = (state: RootState) => state.chat.selectedConversation;
export const selectAutoReplyWithSpeech = (state: RootState) => state.chat.autoReplyWithSpeech;

export const selectSortedChats = createSelector(
  selectChats,
  (chats) => {
    return Object.values(chats)
      .sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
  }
);

export const {resetSelectedChatStatus, addChatNodeContent, changeReplyWithSpeech} = chatSlice.actions;

export default chatSlice.reducer;
