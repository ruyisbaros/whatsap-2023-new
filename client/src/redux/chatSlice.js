import { createSlice } from "@reduxjs/toolkit";
//const user = window.localStorage.getItem("registeredUser");
const initialState = {
  conversations: [],
  messages: [],
  activeConversation: null,
  typedConversation: null,
  notifications: [],
  userStatuses: [],
  chattedUser: null,
  grpChatUsers: [],
  isTyping: false,
  typeTo: null,
  files: [],
  profileFiles: [],
  targets: [],
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
    reduxSetGroupChatUsers: (state, action) => {
      state.grpChatUsers = action.payload;
    },
    reduxGetMyConversations: (state, action) => {
      state.conversations = action.payload;
      let users = [];
      state.conversations.forEach((cnv) => {
        users = [...users, ...cnv.users];
      });
      state.targets = users.reduce((accumulator, current) => {
        if (!accumulator.find((item) => item._id === current._id)) {
          accumulator.push(current);
        }
        return accumulator;
      }, []);
    },
    reduxAddMyConversations: (state, action) => {
      //console.log(action.payload);
      const newConversation = state.conversations?.find(
        (cnv) => cnv._id === action.payload._id
      );
      if (!newConversation) {
        state.conversations.push(action.payload);
      }
      state.conversations = state.conversations.map((c) =>
        c._id === action.payload._id
          ? {
              ...c,
              latestMessage: action.payload.latestMessage,
            }
          : c
      );
      let users = [];
      state.conversations.forEach((cnv) => {
        users = [...users, ...cnv.users];
      });
      state.targets = users.reduce((accumulator, current) => {
        if (!accumulator.find((item) => item._id === current._id)) {
          accumulator.push(current);
        }
        return accumulator;
      }, []);
    },
    reduxRemoveFromMyConversations: (state, action) => {
      state.conversations.pop(action.payload);
    },
    reduxGetMyMessages: (state, action) => {
      state.messages = action.payload;
      let tempArr = [];
      state.messages.forEach((msg) => {
        if (msg.files.length > 0) {
          tempArr = [...tempArr, ...msg.files];
        }
      });
      state.profileFiles = tempArr;
    },

    reduxAddMyMessages: (state, action) => {
      //console.log(action.payload);
      state.messages.push(action.payload);
      //Update latest message
      state.conversations = state.conversations.map((c) =>
        c._id === action.payload.conversation._id
          ? {
              ...c,
              latestMessage: action.payload.conversation.latestMessage,
            }
          : c
      );
      state.activeConversation = {
        ...state.activeConversation,
        latestMessage: action.payload.conversation.latestMessage,
      };
    },
    reduxAddReplyToMessage: (state, action) => {
      state.messages = state.messages.map((msg) =>
        msg._id === action.payload.msgId ? action.payload.data : msg
      );
    },
    reduxAddMyMessagesFromSocket: (state, action) => {
      console.log(action.payload);
      state.messages.push(action.payload);
      //Update latest message
      state.conversations = state.conversations.map((c) =>
        c._id === action.payload.conversation._id
          ? {
              ...c,
              latestMessage: action.payload.conversation.latestMessage,
            }
          : c
      );
    },

    reduxRemoveFromMyMessages: (state, action) => {
      state.messages.pop(action.payload);
    },
    reduxAddUpdateMessage: (state, action) => {
      state.messages = state.messages.map((msg) =>
        msg._id === action.payload.msgId ? action.payload.data : msg
      );
    },

    reduxStartTyping: (state, action) => {
      //console.log(action.payload);
      state.isTyping = action.payload.situation;
      state.typeTo = action.payload.id; //Who is typing on other side
      state.typedConversation = action.payload.convo;
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
                latestMessage: action.payload.message,
              }
            : c
        );
      }
    },
    reduxUpdateLatestMessage: (state, action) => {
      state.isTyping = action.payload.situation;
      if (action.payload.message) {
        state.conversations = state.conversations.map((c) =>
          c._id === action.payload.message.conversation._id
            ? {
                ...c,
                latestMessage: action.payload.message,
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
  reduxAddMyMessagesFromSocket,
  reduxSetChattedUser,
  reduxRemoveActiveConversation,
  reduxStartTyping,
  reduxStopTyping,
  reduxAddFile,
  reduxMakeFilesEmpty,
  reduxRemoveFile,
  reduxSetGroupChatUsers,
  reduxAddUpdateMessage,
  reduxAddReplyToMessage,
  reduxUpdateLatestMessage,
} = chatSlicer.actions;

export default chatSlicer.reducer;
