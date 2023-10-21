import { configureStore } from "@reduxjs/toolkit";
import currentUserSlice from "./currentUserSlice";
import chatSlice from "./chatSlice";
import socketSlicer from "./socketSlicer";

export const store = configureStore({
  reducer: {
    currentUser: currentUserSlice,
    messages: chatSlice,
    sockets: socketSlicer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
