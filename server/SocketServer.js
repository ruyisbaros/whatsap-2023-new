//const { format, formatDistance, formatRelative, subDays } = require("date-fns");
const User = require("./models/userModel");
let users = [];
exports.socketServer = (socket, io) => {
  console.log(`User with ${socket.id} connected`);
  const id = socket.handshake.auth.id;
  const user = users.find((user) => user.id === id);
  if (!user) {
    users.push({ socketId: socket.id, id });
    socket.broadcast.emit("onlineUsers", users);
  }
  console.log(users);
  /* socket.on("joinUser", (id) => {
    const user = users.find((user) => user.id === id);
    if (!user) {
      users.push({ id, socketId: socket.id });
      socket.broadcast.emit("onlineUsers", users);
    }
    socket.emit("setup socketId", socket.id);
    //console.log(users);
  }); */

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
  socket.on("new message group", ({ msg, recipients }) => {
    //console.log(recipients);
    let usersToSend = recipients
      .map((rcp) => users.find((usr) => usr.id === rcp._id))
      .filter((elem, index) => users.indexOf(elem) === index);
    //console.log(usersToSend);

    if (usersToSend.length > 0) {
      usersToSend.forEach((user) => {
        socket.to(user.socketId).emit("new message group", msg);
      });
    }
  });
  socket.on("add emoji group", ({ recipients, msgId, data }) => {
    //console.log(recipients);
    let usersToSend = recipients
      .map((rcp) => users.find((usr) => usr.id === rcp._id))
      .filter((elem, index) => users.indexOf(elem) === index);
    //console.log(usersToSend);

    if (usersToSend.length > 0) {
      usersToSend.forEach((user) => {
        socket.to(user.socketId).emit("add emoji group", { msgId, data });
      });
    }
  });
  socket.on("add emoji", ({ chattedUserId, msgId, data }) => {
    //console.log(chattedUserId);
    const user = users.find((user) => user.id === chattedUserId);
    //console.log(user);
    if (user) {
      socket.to(`${user.socketId}`).emit("add emoji", { msgId, data });
    }
  });
  //Updated conversation list for fresh chat users
  socket.on("update conversationList", ({ newConversation, id }) => {
    const user = users.find((user) => user.id === id);
    //console.log(user);
    if (user) {
      socket
        .to(`${user.socketId}`)
        .emit("update conversationList", newConversation);
    }
  });

  //New Chat Group
  socket.on("new group", ({ data, id }) => {
    data.users.forEach((user) => {
      if (user._id !== id) {
        let socketTo = users.find((usr) => usr.id === user._id);
        if (socketTo) {
          socket.to(socketTo.socketId).emit("new Group", data);
        }
      }
    });
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
  socket.on("typing group", ({ recipients, typer, convo }) => {
    console.log("typing");
    let usersToSend = recipients
      .map((rcp) => users.find((usr) => usr.id === rcp._id))
      .filter((elem, index) => users.indexOf(elem) === index);
    //console.log(usersToSend);

    if (usersToSend.length > 0) {
      usersToSend.forEach((user) => {
        socket.to(user.socketId).emit("typing group", { typer, convo });
      });
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
  socket.on("stop typing group", ({ recipients, convo, message }) => {
    let usersToSend = recipients
      .map((rcp) => users.find((usr) => usr.id === rcp._id))
      .filter((elem, index) => users.indexOf(elem) === index);
    //console.log(usersToSend);

    if (usersToSend.length > 0) {
      usersToSend.forEach((user) => {
        socket.to(user.socketId).emit("stop typing group", { convo, message });
      });
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
