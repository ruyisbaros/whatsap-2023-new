import { configureStore } from "@reduxjs/toolkit";
import currentUserSlice from "./currentUserSlice";
import chatSlice from "./chatSlice";
import socketSlicer from "./socketSlicer";
import callStreamSlicer from "./callStreamSlicer";
import mediaDevicesSlice from "./mediaDevicesSlice";

export const store = configureStore({
  reducer: {
    currentUser: currentUserSlice,
    messages: chatSlice,
    sockets: socketSlicer,
    streams: callStreamSlicer,
    devices: mediaDevicesSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
