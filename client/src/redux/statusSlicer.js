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
  },
});

export const { reduxAddToStatusFiles } = makeStatus.actions;
export default makeStatus.reducer;
