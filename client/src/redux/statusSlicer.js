import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeStatuses: [],
  notSeenStatuses: [],
  statusFiles: [],
  myStatus: null,
  viewedStatus: null,
};

const makeStatus = createSlice({
  name: "statuses",
  initialState,
  reducers: {
    reduxSetMyStatus: (state, action) => {
      state.myStatus = action.payload;
    },
    reduxDeleteMyStatus: (state, action) => {
      state.myStatus = null;
    },
    reduxGetActiveStatuses: (state, action) => {
      state.activeStatuses = action.payload;
    },
    reduxAddActiveStatuses: (state, action) => {
      state.activeStatuses.push(action.payload);
    },
    reduxRemoveFromActiveStatuses: (state, action) => {
      state.activeStatuses = state.activeStatuses.filter(
        (st) => st._id !== action.payload
      );
    },
    reduxSeenInActiveStatuses: (state, action) => {
      state.activeStatuses = state.activeStatuses.map((st) =>
        st._id === action.payload.statusId
          ? st.seenBy.push(action.payload.seenBy)
          : st
      );
    },
    reduxUpdateActiveStatuses: (state, action) => {
      state.activeStatuses = state.activeStatuses.map((st) =>
        st._id === action.payload._id ? action.payload : st
      );
    },
    reduxSetViewedStatus: (state, action) => {
      state.viewedStatus = state.activeStatuses.find(
        (sts) => sts._id === action.payload
      );
    },
    reduxRESetViewedStatus: (state, action) => {
      state.viewedStatus = null;
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
  reduxGetActiveStatuses,
  reduxDeleteMyStatus,
  reduxSeenInActiveStatuses,
  reduxSetViewedStatus,
  reduxRESetViewedStatus,
  reduxUpdateActiveStatuses,
} = makeStatus.actions;
export default makeStatus.reducer;
