import { createAction, createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat, ChatNode } from "../../models";
import axios from '../../axiosInstance';
import { RootState } from "../../app/store";
import { v4 as uuidv4 } from 'uuid';

interface ChatState {
  chats: { [id: string]: Chat };
  selectedChat: Chat | null;
  chatsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  selectedChatStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: ChatState = {
  chats: {},
  selectedChat: null,
  chatsStatus: 'idle',
  selectedChatStatus: 'idle',
};

/**
 * Fetches all chats
 * @param size - number of chats to fetch
 */
export const fetchChats = createAsyncThunk('chat/fetchChats', async ({
                                                                       size = 20,
                                                                     }: { size?: number } = {}) => {
  try {
    const response = await axios.get<Chat[]>('/chats', {
      params: {
        size,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch chats');
  }
});

/**
 * Fetches a chat by id
 * @param chatId - id of the chat to fetch
 * @param currentNode - id of the node to start from (it can be a leaf or a branch)
 * @param upperLimit - number of nodes to fetch above the currentNode (until the root)
 * @param lowerLimit - number of nodes to fetch below the currentNode (the latest child is preferred unless it is a leaf)
 */
export const fetchChatById = createAsyncThunk(
  'chat/fetchChatById',
  async ({
           chatId,
           currentNode = undefined, // TODO: change currentNode in selected Chat
           upperLimit = undefined,
           lowerLimit = undefined
         }: { chatId: string; currentNode?: string; upperLimit?: number, lowerLimit?: number }) => {
    const response = await axios.get<Chat>(`/chats/${chatId}`, {
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
export const updateChatNodeMessageContent = createAsyncThunk(
  'chat/updateMessageContent',
  async ({chatId, nodeId, newContent}: { chatId: string; nodeId: string; newContent: string }) => {
    const response = await axios.patch<ChatNode>(`/chats/${chatId}`, {
      currentNode: nodeId,
      content: newContent
    });
    return {chatId, updatedNode: response.data};
  }
);

export const addChatNodeContent = createAction<{ chatId: string; nodeId: string; content: string }>(
  'chat/addChatNodeContent'
);

/**
 * Creates a new node in the chat
 * @param chatId - id of the chat to add the node to
 * @param nodeId - id of the node to add the new node to (parent of future node)
 * @param newMessage - content of the new node
 */
export const postNewChatNode = createAsyncThunk(
  'chat/postNewChatNode',
  async ({chatId, nodeId, newMessage}: { chatId: string; nodeId: string; newMessage: string }, {dispatch}) => {
    try {
      const response = await axios.post<ChatNode>(`/chats/${chatId}`, {
        currentNode: nodeId, //parentNode
        content: newMessage,
      });
      const createdChatNode = response.data;

      const eventSource = new EventSource(`/chats/${chatId}/sse/node/${createdChatNode.id}`);

      eventSource.onerror = (error) => {
        console.error(error);
      };

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'content-update') {
          const { chatId, nodeId, content } = data.payload;
          dispatch(addChatNodeContent({ chatId, nodeId, content }));
        }
      };

      const result = { chatId, newNode: createdChatNode };
      return {
        result,
        eventSource
      };
    } catch (error) {
      throw new Error('Failed to post new chat node');
    }
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
    return {chatId, newTitle};
  }
);

export const createChat = createAsyncThunk(
  'chat/createChat',
  async () => {
    const newChat: Chat = {
      id: uuidv4(),
      title: 'New Chat',
      createTime: new Date(), // TODO: server should not care about this and text fields
      currentNode: '',
      mapping: {},
    };

    await axios.post('/chats', newChat);
    return newChat;
  }
);

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    resetSelectedChatStatus: (state) => {
      state.selectedChatStatus = 'idle';
    },
    addChatNodeContent: (state, action: PayloadAction<{ chatId: string; nodeId: string; content: string }>) => {
      const { chatId, nodeId, content } = action.payload;
      if (!state.selectedChat) {
        return;
      }

      if (state.selectedChat.id !== chatId) {
        console.error('Chat id does not match the selected chat id');
        return;
      }

      const node = state.selectedChat.mapping[nodeId];
      node.message.content.parts.push(content);
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
      .addCase(fetchChatById.pending, (state) => {
        state.selectedChatStatus = 'loading';
      })
      .addCase(fetchChatById.fulfilled, (state, action) => {
        state.selectedChatStatus = 'succeeded';
        state.selectedChat = action.payload;
      })
      .addCase(fetchChatById.rejected, (state) => {
        state.selectedChatStatus = 'failed';
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        delete state.chats[action.payload];
      })
      .addCase(deleteAllChats.fulfilled, (state) => {
        state.chats = {};
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
      .addCase(updateChatNodeMessageContent.fulfilled, (state, action) => {
        // TODO: test
        const {chatId, updatedNode} = action.payload;
        if (state.selectedChat) {
          if (state.selectedChat.id !== chatId) {
            console.error('Chat id does not match the selected chat id');
            return;
          }

          state.selectedChat.currentNode = updatedNode.id;

          if (updatedNode.parent) {
            state.selectedChat.mapping[updatedNode.parent].children = [updatedNode.id];
          }
          state.selectedChat.mapping[updatedNode.id] = updatedNode;
        }
      })
      .addCase(postNewChatNode.fulfilled, (state, action) => {
        // TODO: test
        const {chatId, newNode} = action.payload.result;

        if (state.selectedChat) {
          if (state.selectedChat.id !== chatId) {
            console.error('Chat id does not match the selected chat id');
            return;
          }

          state.selectedChat.currentNode = newNode.id;

          if (newNode.parent) {
            state.selectedChat.mapping[newNode.parent].children.push(newNode.id);
          }
          state.selectedChat.mapping[newNode.id] = newNode;
        }
      })
  }
});

export const selectChats = (state: RootState) => state.chat.chats;
export const selectChatsStatus = (state: RootState) => state.chat.chatsStatus;
export const selectSelectedChatStatus = (state: RootState) => state.chat.selectedChatStatus;
export const selectSelectedChat = (state: RootState) => state.chat.selectedChat;

export const selectSortedChats = createSelector(
  selectChats,
  (chats) => {
    return Object.values(chats)
      .sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
  }
);

export const {resetSelectedChatStatus} = chatSlice.actions;

export default chatSlice.reducer;
