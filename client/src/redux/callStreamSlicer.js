import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  localStream: null,
  remoteStream: null,
  peerConnection: null,
  offerObject: null,
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
    reduxRemoveStream: (state, action) => {},
    reduxSetOfferObject: (state, action) => {
      state.offerObject = action.payload;
    },
    reduxUpdateOfferer: (state, action) => {
      state.offerObject = {
        ...state.offerObject,
        offer: action.payload.offer,
        offererFullName: action.payload.fullName,
      };
    },
    reduxUpdateOfferObject: (state, action) => {
      state.offerObject = {
        ...state.offerObject,
        answer: action.payload.answer,
        answererFullName: action.payload.loggedUser.fullName,
      };
    },
  },
});

export const {
  reduxAddLocalStream,
  reduxRemoveStream,
  reduxAddRemoteStream,
  reduxAddPeerConnection,
  reduxSetOfferObject,
  reduxUpdateOfferObject,
  reduxUpdateOfferer,
} = makeStreams.actions;
export default makeStreams.reducer;
