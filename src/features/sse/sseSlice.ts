import { createSlice } from '@reduxjs/toolkit';

interface SseState {
  connected: boolean;
  chatId?: string;
  error?: Error;
}

const initialState: SseState = {
  connected: false,
};

export const sseSlice = createSlice({
  name: 'sse',
  initialState,
  reducers: {
    sseStart: (state, action) => {
      state.chatId = action.payload.id;
    },
    sseConnected: (state) => {
      state.connected = true;
    },
    // sseMessageReceived: (state, action) => {
    //   state.messages.push(action.payload);
    // },
    sseError: (state, action) => {
      state.error = action.payload.error;
    },
    sseStop: (state) => state,
    sseDisconnected: (state) => {
      state.connected = false;
    },
  },
});

export const {
  sseStart,
  sseConnected,
  sseError,
  sseStop,
  sseDisconnected,
} = sseSlice.actions;

export default sseSlice.reducer;
