import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat } from "../../models";
import axios from '../../axiosInstance';

interface ChatState {
  chats: Chat[]; //TODO: we need just title and meta info, because mapping will be loaded on demand
  status: 'idle' | 'loading' | 'succeeded'| 'failed';
}

const initialState: ChatState = {
  chats: [],
  status: 'idle',
};

export const fetchChats = createAsyncThunk('chat/fetchChats', async () => {
  try {
    const response = await axios.get<Chat[]>('/chats');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch chats');
  }
});

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // setChats: (state, action: PayloadAction<Chat[]>) => {
    //   state.chats = action.payload;
    // },
    // setStatus: (state, action: PayloadAction<ChatState['status']>) => {
    //   state.status = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state) => {
        state.status = 'failed';
      });
  }
});


// export const { setChats, setStatus } = chatSlice.actions;

export default chatSlice.reducer;
