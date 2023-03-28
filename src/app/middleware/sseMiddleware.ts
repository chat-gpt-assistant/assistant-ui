import { Middleware } from '@reduxjs/toolkit';
import {
  sseConnected,
  sseDisconnected,
  sseError,
  sseStart,
  sseStop
} from "../../features/sse/sseSlice";
import { addChatNodeContent } from "../../features/chat/chatSlice";

const host = 'http://localhost:8080';

let eventSource: EventSource | undefined;

export const sseMiddleware: Middleware = (store) => (next) => (action) => {
  if (action.type === sseStart.type) {
    if (eventSource) {
      eventSource.close();
    }

    const { id } = action.payload;

    eventSource = new EventSource(`${host}/api/v1/chats/${id}/conversation/sse`);

    eventSource.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      store.dispatch(addChatNodeContent(payload));
    };

    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      store.dispatch(sseError({error}));
    };

    store.dispatch(sseConnected());
  } else if (action.type === sseStop.type) {
    if (eventSource) {
      eventSource.close();
      eventSource = undefined;
      store.dispatch(sseDisconnected());
    }
  }

  return next(action);
};
