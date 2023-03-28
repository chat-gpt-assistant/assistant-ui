import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import chatReducer from '../features/chat/chatSlice';
import sseReducer from '../features/sse/sseSlice';
import { sseMiddleware } from "./middleware/sseMiddleware";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    sse: sseReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sseMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
