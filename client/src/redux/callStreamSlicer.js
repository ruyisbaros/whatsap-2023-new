import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  localStream: null,
  remoteStream: null,
  peerConnection: null,
  offerObject: { offer: "", answer: "" },
  haveOffer: false,
};

const makeStreams = createSlice({
  name: "streams",
  initialState,
  reducers: {
    reduxAddLocalStream: (state, action) => {
      state.localStream = action.payload;
    },
    reduxUpdateHaveOffer: (state, action) => {
      state[action.payload.have] = action.payload.value;
    },
    reduxAddRemoteStream: (state, action) => {
      state.remoteStream = action.payload;
    },
    reduxAddPeerConnection: (state, action) => {
      state.peerConnection = action.payload;
    },
    reduxRemoveStream: (state, action) => {},
    reduxSetOffer: (state, action) => {
      state.offerObject = { ...state.offerObject, offer: action.payload };
    },
    reduxSetAnswer: (state, action) => {
      state.offerObject = { ...state.offerObject, answer: action.payload };
    },
  },
});

export const {
  reduxAddLocalStream,
  reduxRemoveStream,
  reduxAddRemoteStream,
  reduxAddPeerConnection,
  reduxUpdateHaveOffer,
  reduxSetOffer,
  reduxSetAnswer,
} = makeStreams.actions;
export default makeStreams.reducer;
