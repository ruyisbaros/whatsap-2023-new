import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeStatuses: [],
  notSeenStatuses: [],
  statusFiles: [],
};

const makeStatus = createSlice({
  name: "statuses",
  initialState,
  reducers: {
    reduxAddToStatusFiles: (state, action) => {
      state.statusFiles.push(action.payload);
    },
    reduxMakeStatusFilesEmpty: (state, action) => {
      state.statusFiles = [];
    },
    reduxRemoveStatusFile: (state, action) => {
      //state.files = state.files.splice(action.payload, 1);
      const index = action.payload;
      let files = [...state.statusFiles];
      let fileToRemove = [files[index]];
      state.statusFiles = files.filter((f) => !fileToRemove.includes(f));
    },
  },
});

export const {
  reduxAddToStatusFiles,
  reduxMakeStatusFilesEmpty,
  reduxRemoveStatusFile,
} = makeStatus.actions;
export default makeStatus.reducer;
