//const { format, formatDistance, formatRelative, subDays } = require("date-fns");
const User = require("./models/userModel");
let users = [];
exports.socketServer = (socket, io) => {
  console.log(`User with ${socket.id} connected`);
  //Join User (Online)
  socket.on("joinUser", (id) => {
    const user = users.find((user) => user.id === id);
    if (!user) {
      users.push({ id, socketId: socket.id });
      socket.broadcast.emit("onlineUsers", users);
    }
    socket.emit("setup socketId", socket.id);
    console.log(users);
  });

  socket.on("disconnect", async () => {
    const user = users.find((u) => u.socketId === socket.id);
    users = users.filter((user) => user.socketId !== socket.id);
    //console.log(users);
    //console.log(user);
    const date = new Date();
    if (user) {
      await User.findByIdAndUpdate(user.id, {
        lastSeen: date,
      });
    }
    socket.broadcast.emit("offlineUsers", user?.id);
  });
  socket.on("logout", async (id) => {
    const user = users.find((u) => u.id === id);
    users = users.filter((user) => user.socketId !== socket.id);
    //console.log(users);
    //console.log(user);
    const date = new Date();
    if (user) {
      await User.findByIdAndUpdate(user.id, {
        lastSeen: date,
      });
    }
    socket.broadcast.emit("offlineUsers", user?.id);
  });

  //Join a conversation room with conversation id
  socket.on("Join conversation", (conversationId) => {
    socket.join(conversationId);
    console.log("User joined conversation: ", conversationId);
  });

  //Send receive messages
  socket.on("new message", ({ msg, id }) => {
    const user = users.find((user) => user.id === id);
    //console.log("Users: ", users);
    //console.log("User: ", user);

    if (user) {
      socket.to(`${user.socketId}`).emit("new message", msg);
    }
  });

  //Updated conversation list for fresh chat users
  socket.on("update conversationList", ({ newConversation, id }) => {
    const user = users.find((user) => user.id === id);
    console.log(user);
    if (user) {
      socket
        .to(`${user.socketId}`)
        .emit("update conversationList", newConversation);
    }
  });

  //OPEN Typing
  socket.on("typing", ({ chattedUserId, typeTo, convo }) => {
    //console.log(id, id2);
    const user = users.find((user) => user.id === chattedUserId);
    //console.log(user);
    if (user) {
      socket
        .to(`${user.socketId}`)
        .emit("openTypingToClient", { typeTo, convo });
    }
  });
  //Stop Typing
  socket.on("stop typing", ({ chattedUserId, convo, message }) => {
    //console.log(userId);
    //console.log(convo);
    const user = users.find((user) => user.id === chattedUserId);
    //console.log(user);
    if (user) {
      socket
        .to(`${user.socketId}`)
        .emit("closeTypingToClient", { convo, message });
    }
  });

  //Video Calls
  socket.on("newOffer", ({ target, offer, name, picture, offerer }) => {
    const user = users.find((user) => user.id === target);
    if (user) {
      io.to(user.socketId).emit("newOfferCame", {
        offer,
        name,
        picture,
        offerer,
      });
    }
  });
  socket.on("newAnswer", ({ offerer, answer }) => {
    const user = users.find((user) => user.id === offerer);
    if (user) {
      io.to(user.socketId).emit("newAnswerCame", answer);
    }
  });
  socket.on("iceToServer", ({ iceCandidate, target }) => {
    //console.log("candidate: ", target);
    const user = users.find((user) => user.id === target);
    if (user) {
      io.to(user.socketId).emit("iceToClient", iceCandidate);
    }
  });
  socket.on("callRejected", (offerer) => {
    const user = users.find((user) => user.id === offerer);
    if (user) {
      io.to(user.socketId).emit("callRejected");
    }
  });

  socket.on("callEnded", (userTo) => {
    const user = users.find((user) => user.id === userTo);
    if (user) {
      io.to(user.socketId).emit("callEnded");
    }
  });
  socket.on("cancelCall", (userTo) => {
    const user = users.find((user) => user.id === userTo);
    if (user) {
      io.to(user.socketId).emit("cancelCall");
    }
  });
};
