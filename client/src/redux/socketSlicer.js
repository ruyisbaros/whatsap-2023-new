import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  socket: "",
};

const makeSocket = createSlice({
  name: "sockets",
  initialState,
  reducers: {
    createSocket: (state, action) => {
      state.socket = action.payload;
    },
  },
});

export const { createSocket } = makeSocket.actions;
export default makeSocket.reducer;
