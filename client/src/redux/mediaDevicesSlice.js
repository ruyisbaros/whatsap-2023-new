import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cameraDevices: [],
  audioDevices: [],
  activeCameraDevice: "default",
  activeAudioDevice: "default",
};

const makeSocket = createSlice({
  name: "devices",
  initialState,
  reducers: {
    reduxSetDevices: (state, action) => {
      state.cameraDevices = action.payload.filter(
        (dvc) => dvc.kind === "videoinput"
      );
      state.audioDevices = action.payload.filter(
        (dvc) => dvc.kind === "audioinput" || dvc.kind === "audiooutput"
      );
    },
    reduxSetActiveCamera: (state, action) => {
      state.activeCameraDevice = action.payload;
    },
    reduxSetActiveAudio: (state, action) => {
      state.activeAudioDevice = action.payload;
    },
  },
});

export const { reduxSetDevices, reduxSetActiveCamera, reduxSetActiveAudio } =
  makeSocket.actions;
export default makeSocket.reducer;
