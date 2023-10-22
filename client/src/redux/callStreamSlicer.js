import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  localStream: null,
  remoteStream: null,
  peerConnection: null,
  offerObject: { offer: "", answer: "" },
  iceCandidates: [],
};

const makeStreams = createSlice({
  name: "streams",
  initialState,
  reducers: {
    reduxAddLocalStream: (state, action) => {
      state.localStream = action.payload;
    },

    reduxAddRemoteStream: (state, action) => {
      state.remoteStream = action.payload;
    },
    reduxAddPeerConnection: (state, action) => {
      state.peerConnection = action.payload;
    },
    reduxRemoveStreamPeer: (state, action) => {
      state.localStream = null;
      state.remoteStream = null;
      state.peerConnection = null;
      state.offerObject = { offer: "", answer: "" };
      state.iceCandidates = [];
    },
    reduxSetOffer: (state, action) => {
      state.offerObject = { ...state.offerObject, offer: action.payload };
    },
    reduxSetAnswer: (state, action) => {
      state.offerObject = { ...state.offerObject, answer: action.payload };
    },
    reduxAddIceCandidate: (state, action) => {
      state.iceCandidates.push(action.payload);
    },
  },
});

export const {
  reduxAddLocalStream,
  reduxRemoveStreamPeer,
  reduxAddRemoteStream,
  reduxAddPeerConnection,
  reduxSetOffer,
  reduxSetAnswer,
  reduxAddIceCandidate,
} = makeStreams.actions;
export default makeStreams.reducer;
