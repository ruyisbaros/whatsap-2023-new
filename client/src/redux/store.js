import { configureStore } from "@reduxjs/toolkit";
import currentUserSlice from "./currentUserSlice";
import chatSlice from "./chatSlice";
import socketSlicer from "./socketSlicer";
import callStreamSlicer from "./callStreamSlicer";
import mediaDevicesSlice from "./mediaDevicesSlice";
import callingsSlice from "./callingsSlice";
import statusSlicer from "./statusSlicer";

export const store = configureStore({
  reducer: {
    currentUser: currentUserSlice,
    messages: chatSlice,
    sockets: socketSlicer,
    streams: callStreamSlicer,
    devices: mediaDevicesSlice,
    callStatuses: callingsSlice,
    statuses: statusSlicer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
