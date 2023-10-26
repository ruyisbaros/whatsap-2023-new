import { io } from "socket.io-client";
import { store } from "./redux/store";
import { BACKEND_URL } from "./axios";
import {
  reduxAddEmojiToMessage,
  reduxAddMyConversations,
  reduxAddMyMessagesFromSocket,
  reduxAddReplyToMessage,
  reduxStartTyping,
  reduxStopTyping,
} from "./redux/chatSlice";
import {
  reduxAUserBecameOffline,
  reduxSetMySocketId,
  reduxSetOnlineUsers,
} from "./redux/currentUserSlice";

import { createSocket } from "./redux/socketSlicer";
import { reduxUpdateCallStatus } from "./redux/callingsSlice";
import {
  reduxAddIceCandidate,
  reduxRemoveStreamPeer,
  reduxSetAnswer,
  reduxSetOffer,
} from "./redux/callStreamSlicer";
let socket;

const loggedUser = store.getState().currentUser.loggedUser;
socket = io(BACKEND_URL, {
  auth: {
    id: loggedUser.id,
  },
});

socket.on("connect", () => {
  console.log("Connected to socket io server");
  store.dispatch(createSocket(socket));
});
socket.on("setup socketId", (id) => {
  //console.log("remote socket id ", id);
  store.dispatch(reduxSetMySocketId(id));
});
socket.on("new message", (msg) => {
  store.dispatch(reduxAddMyMessagesFromSocket(msg));
});
socket.on("new message group", (msg) => {
  store.dispatch(reduxAddMyMessagesFromSocket(msg));
});
socket.on("reply message", ({ msg, msgId }) => {
  store.dispatch(
    reduxAddReplyToMessage({
      data: msg,
      msgId,
    })
  );
});
socket.on("reply message group", ({ msg, msgId }) => {
  store.dispatch(
    reduxAddReplyToMessage({
      data: msg,
      msgId,
    })
  );
});
socket.on("update conversationList", (convo) => {
  store.dispatch(reduxAddMyConversations(convo));
});
socket.on("new Group", (convo) => {
  store.dispatch(reduxAddMyConversations(convo));
});
socket.on("onlineUsers", (users) => {
  console.log(users);
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
socket.on("typing group", ({ typer, convo }) => {
  store.dispatch(reduxStartTyping({ situation: true, id: typer, convo }));
});
socket.on("stop typing group", ({ convo, message }) => {
  store.dispatch(reduxStopTyping({ situation: false, convo, message }));
});
socket.on("add emoji", ({ msgId, data }) => {
  store.dispatch(reduxAddEmojiToMessage({ data, msgId }));
});
socket.on("add emoji group", ({ msgId, data }) => {
  store.dispatch(reduxAddEmojiToMessage({ data, msgId }));
});
socket.on("newOfferCame", ({ offer, name, picture, offerer }) => {
  console.log("new offer received");
  store.dispatch(reduxUpdateCallStatus({ cst: "videoScreen", value: true }));
  store.dispatch(reduxUpdateCallStatus({ cst: "receivingCall", value: true }));
  store.dispatch(reduxUpdateCallStatus({ cst: "name", value: name }));
  store.dispatch(reduxUpdateCallStatus({ cst: "picture", value: picture }));
  store.dispatch(reduxUpdateCallStatus({ cst: "offerer", value: offerer }));
  store.dispatch(reduxSetOffer(offer));
});
socket.on("newAnswerCame", (answer) => {
  console.log("new answer received");
  store.dispatch(reduxUpdateCallStatus({ cst: "callAccepted", value: true }));
  store.dispatch(reduxSetAnswer(answer));
});
socket.on("iceToClient", (iceCandidate) => {
  console.log("ice candidate received");
  store.dispatch(reduxAddIceCandidate(iceCandidate));
});
socket.on("callRejected", () => {
  store.dispatch(reduxUpdateCallStatus({ cst: "callRejected", value: true }));
});
socket.on("callEnded", () => {
  const peerConnection = store.getState().streams.peerConnection;
  const localStream = store.getState().streams.localStream;
  peerConnection.close();
  peerConnection.onicecandidate = null;
  peerConnection.onaddstream = null;
  localStream.getVideoTracks().forEach((track) => {
    track.stop();
  });
  store.dispatch(reduxUpdateCallStatus({ cst: "videoScreen", value: false }));
  store.dispatch(reduxUpdateCallStatus({ cst: "callEnded", value: true }));
  store.dispatch(reduxUpdateCallStatus({ cst: "callRejected", value: false }));
  store.dispatch(reduxUpdateCallStatus({ cst: "caller", value: false }));
  store.dispatch(reduxUpdateCallStatus({ cst: "callee", value: false }));
  store.dispatch(reduxUpdateCallStatus({ cst: "cstOffer", value: false }));
  store.dispatch(reduxUpdateCallStatus({ cst: "offerer", value: "" }));
  store.dispatch(reduxUpdateCallStatus({ cst: "name", value: "" }));
  store.dispatch(reduxUpdateCallStatus({ cst: "picture", value: "" }));
  store.dispatch(reduxUpdateCallStatus({ cst: "current", value: "idle" }));
  store.dispatch(reduxUpdateCallStatus({ cst: "haveOffer", value: false }));
  store.dispatch(reduxUpdateCallStatus({ cst: "receivingCall", value: false }));
  store.dispatch(reduxUpdateCallStatus({ cst: "callAccepted", value: false }));
  store.dispatch(reduxRemoveStreamPeer());
});

socket.on("cancelCall", () => {
  store.dispatch(reduxUpdateCallStatus({ cst: "videoScreen", value: false }));
  store.dispatch(reduxUpdateCallStatus({ cst: "receivingCall", value: false }));
  store.dispatch(reduxUpdateCallStatus({ cst: "name", value: "" }));
  store.dispatch(reduxUpdateCallStatus({ cst: "picture", value: "" }));
  store.dispatch(reduxUpdateCallStatus({ cst: "offerer", value: "" }));
});

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
export const sendNewMessageToGroup = (msg, recipients) => {
  socket?.emit("new message group", { msg, recipients });
};
export const sendReplyMessage = (msg, id, msgId) => {
  socket?.emit("reply message", { msg, id, msgId });
};
export const sendReplyMessageToGroup = (msg, recipients, msgId) => {
  socket?.emit("reply message group", { msg, recipients, msgId });
};
//first time chat means other user's conversation list should include me real time
export const createNewConversation = (newConversation, id) => {
  socket?.emit("update conversationList", { newConversation, id });
};
export const createNewGroup = (data, id) => {
  socket?.emit("new group", { data, id });
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
export const groupStartMessageTyping = (recipients, typer, convo) => {
  socket?.emit("typing group", { recipients, typer, convo });
};

export const groupStopMessageTyping = (recipients, convo, message) => {
  socket?.emit("stop typing group", { recipients, convo, message });
};

export const userAddMessageEmoji = (chattedUserId, msgId, data) => {
  socket?.emit("add emoji", { chattedUserId, msgId, data });
};
export const groupAddMessageEmoji = (recipients, msgId, data) => {
  socket?.emit("add emoji group", { recipients, msgId, data });
};
