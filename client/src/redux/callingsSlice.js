import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  receivingCall: false,
  callEnded: false,
  callAccepted: false,
  videoScreen: false,
  name: "",
  picture: "",
  callerSocketId: "",
  signal: "",
  ringingMuted: false,
};

const calls = createSlice({
  name: "callStatuses",
  initialState,
  reducers: {
    reduxUpdateCallStatus: (state, action) => {
      state[action.payload.cst] = action.payload.value;
    },
  },
});

export const { reduxUpdateCallStatus } = calls.actions;
export default calls.reducer;
