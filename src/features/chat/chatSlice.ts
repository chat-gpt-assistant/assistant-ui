import { createAction, createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat, Conversation } from "../../models";
import axios from '../../axiosInstance';
import { RootState } from "../../app/store";

export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface ChatState {
  chats: { [id: string]: Chat };
  selectedConversation: Conversation | null;
  chatsStatus: LoadingStatus;
  selectedConversationStatus: LoadingStatus;
  isAssistantResponding: boolean;
}

const initialState: ChatState = {
  chats: {},
  selectedConversation: null,
  chatsStatus: 'idle',
  selectedConversationStatus: 'idle',
  isAssistantResponding: false,
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
    const response = await axios.patch<Conversation>(`/chats/${chatId}/conversation/${nodeId}`, {
      content: newContent
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

  state.isAssistantResponding = true;

  state.selectedConversation.currentNode = conversation.currentNode;
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

      updateStateWithConversationDiff(state, conversation);

      const currentNodeId = conversation.currentNode;
      const currentNode = conversation.mapping[currentNodeId];
      if (currentNode && currentNode.message.content.final) {
        state.isAssistantResponding = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.chatsStatus = 'loading';
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.chatsStatus = 'succeeded';
        action.payload.forEach(chat => {
          state.chats[chat.id] = chat;
        });
      })
      .addCase(fetchChats.rejected, (state) => {
        state.chatsStatus = 'failed';
      })
      .addCase(fetchConversationByChatId.pending, (state) => {
        state.selectedConversationStatus = 'loading';
      })
      .addCase(fetchConversationByChatId.fulfilled, (state, action) => {
        state.selectedConversationStatus = 'succeeded';
        state.selectedConversation = action.payload;
      })
      .addCase(fetchConversationByChatId.rejected, (state) => {
        state.selectedConversationStatus = 'failed';
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        delete state.chats[action.payload];
        state.selectedConversation = null;
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
      .addCase(updateConversationMessageContent.pending , (state, action) => {
        state.isAssistantResponding = true;
      })
      .addCase(updateConversationMessageContent.fulfilled, (state, action) => {
        // TODO: test
        const conversation = action.payload;

        updateStateWithConversationDiff(state, conversation);
      })
      .addCase(postNewMessageToConversation.pending , (state, action) => {
        state.isAssistantResponding = true;
      })
      .addCase(postNewMessageToConversation.fulfilled, (state, action) => {
        const conversation = action.payload;

        updateStateWithConversationDiff(state, conversation);
      })
  }
});

export const selectChats = (state: RootState) => state.chat.chats;
export const selectChatsStatus = (state: RootState) => state.chat.chatsStatus;
export const selectSelectedConversationStatus = (state: RootState) => state.chat.selectedConversationStatus;
export const selectIsAssistantResponding = (state: RootState) => state.chat.isAssistantResponding;
export const selectSelectedConversation = (state: RootState) => state.chat.selectedConversation;

export const selectSortedChats = createSelector(
  selectChats,
  (chats) => {
    return Object.values(chats)
      .sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
  }
);

export const {resetSelectedChatStatus, addChatNodeContent} = chatSlice.actions;

export default chatSlice.reducer;
