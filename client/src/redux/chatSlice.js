import { createSlice } from "@reduxjs/toolkit";
//const user = window.localStorage.getItem("registeredUser");
const initialState = {
  conversations: [],
  messages: [],
  activeConversation: null,
  notifications: [],
  userStatuses: [],
  chattedUser: null,
  isTyping: false,
  typeTo: null,
  files: [],
};

const chatSlicer = createSlice({
  name: "messages",
  initialState,
  reducers: {
    reduxSetActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
      state.files = [];
    },
    reduxRemoveActiveConversation: (state, action) => {
      state.activeConversation = null;
    },
    reduxSetChattedUser: (state, action) => {
      state.chattedUser = action.payload;
    },
    reduxGetMyConversations: (state, action) => {
      state.conversations = action.payload;
    },
    reduxAddMyConversations: (state, action) => {
      //console.log(action.payload);
      const newConversation = state.conversations?.find(
        (cnv) => cnv._id === action.payload._id
      );
      if (!newConversation) {
        state.conversations.push(action.payload);
      }
    },
    reduxRemoveFromMyConversations: (state, action) => {
      state.conversations.pop(action.payload);
    },
    reduxGetMyMessages: (state, action) => {
      state.messages = action.payload;
    },
    reduxAddMyMessages: (state, action) => {
      console.log(action.payload);
      state.messages.push(action.payload);
      //Update latest message
      state.conversations = state.conversations.map((c) =>
        c._id === action.payload.conversation._id
          ? {
              ...c,
              latestMessage: { ...action.payload.conversation.latestMessage },
            }
          : c
      );
    },
    reduxAddMyMessagesFromSocket: (state, action) => {
      state.messages.push(action.payload);
      //Update latest message
      state.conversations = state.conversations.map((c) =>
        c._id === action.payload.conversation._id
          ? {
              ...c,
              latestMessage: {
                ...c.latestMessage,
                message: action.payload.message,
                files: action.payload.files,
              },
            }
          : c
      );
    },
    reduxRemoveFromMyMessages: (state, action) => {
      state.messages.pop(action.payload);
    },
    reduxMakeMessagesSeen: (state, action) => {
      const { logId, convoId } = action.payload;
      state.messages = state.messages.map((msg) =>
        msg.sender._id !== logId &&
        !msg.seen &&
        msg.conversation._id === convoId
          ? { ...msg, seen: true }
          : msg
      );
    },
    reduxStartTyping: (state, action) => {
      //console.log(action.payload);
      state.isTyping = action.payload.situation;
      state.typeTo = action.payload.id;
      state.conversations = state.conversations.map((c) =>
        c._id === action.payload.convo._id
          ? {
              ...c,
              latestMessage: {
                ...c.latestMessage,
                message: "Typing...",
                files: [],
              },
            }
          : c
      );
    },
    reduxStopTyping: (state, action) => {
      state.isTyping = action.payload.situation;
      //console.log(action.payload.convo._id);
      //Re Update latest message after stop typing
      if (action.payload.convo) {
        state.conversations = state.conversations.map((c) =>
          c._id === action.payload.convo._id
            ? { ...c, latestMessage: action.payload.convo.latestMessage }
            : c
        );
      } else if (action.payload.message) {
        state.conversations = state.conversations.map((c) =>
          c._id === action.payload.message.conversation._id
            ? {
                ...c,
                latestMessage:
                  action.payload.message.conversation.latestMessage,
              }
            : c
        );
      }
    },
    reduxAddFile: (state, action) => {
      state.files.push(action.payload);
    },
    reduxRemoveFile: (state, action) => {
      //state.files = state.files.splice(action.payload, 1);
      const index = action.payload;
      let files = [...state.files];
      let fileToRemove = [files[index]];
      state.files = files.filter((f) => !fileToRemove.includes(f));
    },
    reduxMakeFilesEmpty: (state, action) => {
      state.files = [];
    },
  },
});

export const {
  reduxSetActiveConversation,
  reduxGetMyConversations,
  reduxAddMyConversations,
  reduxRemoveFromMyConversations,
  reduxGetMyMessages,
  reduxAddMyMessages,
  reduxRemoveFromMyMessages,
  reduxMakeMessagesSeen,
  reduxAddMyMessagesFromSocket,
  reduxSetChattedUser,
  reduxRemoveActiveConversation,
  reduxStartTyping,
  reduxStopTyping,
  reduxAddFile,
  reduxMakeFilesEmpty,
  reduxRemoveFile,
} = chatSlicer.actions;

export default chatSlicer.reducer;
