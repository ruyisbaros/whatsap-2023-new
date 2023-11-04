import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeStatuses: [],
  notSeenStatuses: [],
  statusFiles: [],
  myStatus: null,
};

const makeStatus = createSlice({
  name: "statuses",
  initialState,
  reducers: {
    reduxSetMyStatus: (state, action) => {
      state.myStatus = action.payload;
    },
    reduxAddActiveStatuses: (state, action) => {
      state.activeStatuses.push(action.payload);
    },
    reduxRemoveFromActiveStatuses: (state, action) => {
      state.activeStatuses = state.activeStatuses.filter(
        (st) => st._id !== action.payload._id
      );
    },
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
  reduxSetMyStatus,
  reduxAddActiveStatuses,
  reduxRemoveFromActiveStatuses,
} = makeStatus.actions;
export default makeStatus.reducer;
