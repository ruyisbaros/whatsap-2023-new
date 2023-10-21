import { io } from "socket.io-client";
import { store } from "./redux/store";
import { BACKEND_URL } from "./axios";
import {
  reduxAddMyConversations,
  reduxAddMyMessagesFromSocket,
  reduxStartTyping,
  reduxStopTyping,
} from "./redux/chatSlice";
import {
  reduxAUserBecameOffline,
  reduxSetMySocketId,
  reduxSetOnlineUsers,
} from "./redux/currentUserSlice";

import { createSocket } from "./redux/socketSlicer";
let socket;

export const connectToSocketServer = () => {
  socket = io(BACKEND_URL);

  socket.on("connect", () => {
    console.log("Connected to socket io server");
    store.dispatch(createSocket(socket));
  });
  socket.on("setup socketId", (id) => {
    console.log("remote socket id ", id);
    store.dispatch(reduxSetMySocketId(id));
  });
  socket.on("new message", (msg) => {
    store.dispatch(reduxAddMyMessagesFromSocket(msg));
  });
  socket.on("update conversationList", (convo) => {
    store.dispatch(reduxAddMyConversations(convo));
  });
  socket.on("onlineUsers", (users) => {
    window.localStorage.setItem("onlineUsers", JSON.stringify(users));
    store.dispatch(reduxSetOnlineUsers(users));
  });
  socket.on("offlineUsers", (id) => {
    let onUsers = window.localStorage.getItem("onlineUsers");
    onUsers = JSON.parse(onUsers);
    onUsers = onUsers?.filter((usr) => usr.id !== id);
    window.localStorage.setItem("onlineUsers", JSON.stringify(onUsers));
    store.dispatch(reduxAUserBecameOffline(id));
  });

  socket.on("openTypingToClient", ({ typeTo, convo }) => {
    store.dispatch(reduxStartTyping({ situation: true, id: typeTo, convo }));
  });
  socket.on("closeTypingToClient", ({ convo, message }) => {
    store.dispatch(reduxStopTyping({ situation: false, convo, message }));
  });
};
//Emit user activities
export const joinUser = (id) => {
  socket?.emit("joinUser", id);
};

export const joinAConversation = (convo) => {
  socket?.emit("Join conversation", convo);
};

export const sendNewMessage = (msg, id) => {
  socket?.emit("new message", { msg, id });
};
//first time chat means other user's conversation list should include me real time
export const createNewConversation = (newConversation, id) => {
  socket?.emit("update conversationList", { newConversation, id });
};
export const logoutDisconnect = (id) => {
  socket?.emit("logout", id);
};

export const userStartMessageTyping = (chattedUserId, typeTo, convo) => {
  socket?.emit("typing", { chattedUserId, typeTo, convo });
};

export const userStopMessageTyping = (chattedUserId, convo, message) => {
  socket?.emit("stop typing", { chattedUserId, convo, message });
};
