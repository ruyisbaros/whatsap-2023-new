import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  receivingCall: false,
  callEnded: false,
  callAccepted: false,
  videoScreen: false,
  name: "",
  picture: "",
  ringingMuted: false,
  offerer: "",
  caller: false,
  callee: false,
  current: "idle",
  callRejected: false,
  haveOffer: false,
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
