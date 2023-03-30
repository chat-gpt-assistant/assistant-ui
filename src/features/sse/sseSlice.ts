import { createSlice } from '@reduxjs/toolkit';
import { RootState } from "../../app/store";

interface SseState {
  connected: boolean;
  chatId?: string;
  error?: string;
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
      state.error = action.payload.error.toString();
    },
    sseStop: (state) => {
    },
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

export const selectConnected = (state: RootState) => state.sse.connected;

export default sseSlice.reducer;
