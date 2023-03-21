import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat } from "../../models";
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

export const fetchChats = createAsyncThunk('chat/fetchChats', async () => {
  try {
    const response = await axios.get<Chat[]>('/chats'); // // TODO: we need to add params for pagination of chat nodes (0 by default for this endpoint)
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch chats');
  }
});

export const fetchChatById = createAsyncThunk(
  'chat/fetchChatById',
  async (chatId: string) => {
    const response = await axios.get<Chat>(`/chats/${chatId}`); // TODO: we need to add params for pagination of chat nodes
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
  async ({ chatId, newTitle }: { chatId: string; newTitle: string }) => {
    const response = await axios.patch(`/chats/${chatId}`, { title: newTitle });
    return { chatId, newTitle };
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
        const { chatId, newTitle } = action.payload;
        if (state.chats[chatId]) {
          state.chats[chatId].title = newTitle;
        }
      })
      .addCase(createChat.fulfilled, (state, action) => {
        const newChat = action.payload;
        state.chats[newChat.id] = newChat;
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
    return Object.values(chats).sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
  }
);

export const { resetSelectedChatStatus } = chatSlice.actions;

export default chatSlice.reducer;
