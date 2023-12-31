//const { format, formatDistance, formatRelative, subDays } = require("date-fns");
const User = require("./models/userModel");
let users = [];
exports.socketServer = (socket, io) => {
  console.log(`User with ${socket.id} connected`);
  const id = socket.handshake.auth.id;
  const user = users.find((user) => String(user.id) === String(id));
  console.log(user);
  if (!user) {
    users.push({ socketId: socket.id, id });
    socket.broadcast.emit("onlineUsers", users);
  } else {
    socket.broadcast.emit("onlineUsers", users);
  }
  console.log(users);
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

  //Join a conversation room with conversation id
  socket.on("Join conversation", (conversationId) => {
    socket.join(conversationId);
    console.log("User joined conversation: ", conversationId);
  });

  //Send receive messages
  socket.on("new message", ({ msg, id }) => {
    const user = users.find((user) => user.id === id);
    if (user) {
      socket.to(`${user.socketId}`).emit("new message", { msg });
    }
  });
  socket.on("new message group", ({ msg, recipients }) => {
    //console.log(recipients);
    let usersToSend = recipients
      .map((rcp) => users.find((usr) => usr.id === rcp._id))
      .filter((el) => el !== undefined);

    //console.log(usersToSend);

    if (usersToSend.length > 0) {
      usersToSend.forEach((user) => {
        socket.to(user.socketId).emit("new message group", { msg });
      });
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
      .filter((el) => el !== undefined);

    //console.log(usersToSend);

    if (usersToSend.length > 0) {
      usersToSend.forEach((user) => {
        if (user) {
          socket.to(user.socketId).emit("typing group", { typer, convo });
        }
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
      .filter((el) => el !== undefined);
    console.log(usersToSend);

    if (usersToSend.length > 0) {
      usersToSend.forEach((user) => {
        socket.to(user.socketId).emit("stop typing group", { convo, message });
      });
    }
  });
  socket.on("update latest message", ({ chattedUserId, message }) => {
    //console.log(userId);
    //console.log(message);
    const user = users.find((user) => user.id === chattedUserId);
    //console.log(user);
    if (user) {
      socket.to(`${user.socketId}`).emit("update latest message", { message });
    }
  });
  socket.on("update latest message group", ({ recipients, message }) => {
    let usersToSend = recipients
      .map((rcp) => users.find((usr) => usr.id === rcp._id))
      .filter((el) => el !== undefined);

    //console.log(usersToSend);

    if (usersToSend.length > 0) {
      usersToSend.forEach((user) => {
        socket.to(user.socketId).emit("update latest message", { message });
      });
    }
  });

  socket.on("add emoji group", ({ recipients, msgId, data }) => {
    //console.log(recipients);
    let usersToSend = recipients
      .map((rcp) => users.find((usr) => usr.id === rcp._id))
      .filter((el) => el !== undefined);

    //console.log(usersToSend);

    if (usersToSend.length > 0) {
      usersToSend.forEach((user) => {
        socket.to(user.socketId).emit("add emoji", { msgId, data });
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

  socket.on("give star group", ({ recipients, msgId, data }) => {
    //console.log(recipients);
    let usersToSend = recipients
      .map((rcp) => users.find((usr) => usr.id === rcp._id))
      .filter((el) => el !== undefined);

    //console.log(usersToSend);

    if (usersToSend.length > 0) {
      usersToSend.forEach((user) => {
        socket.to(user.socketId).emit("give star", { msgId, data });
      });
    }
  });
  socket.on("give star", ({ chattedUserId, msgId, data }) => {
    //console.log(chattedUserId);
    const user = users.find((user) => user.id === chattedUserId);
    //console.log(user);
    if (user) {
      socket.to(`${user.socketId}`).emit("give star", { msgId, data });
    }
  });

  socket.on("cancel star group", ({ recipients, msgId, data }) => {
    //console.log(recipients);
    let usersToSend = recipients
      .map((rcp) => users.find((usr) => usr.id === rcp._id))
      .filter((el) => el !== undefined);

    //console.log(usersToSend);

    if (usersToSend.length > 0) {
      usersToSend.forEach((user) => {
        socket.to(user.socketId).emit("cancel star", { msgId, data });
      });
    }
  });
  socket.on("cancel star", ({ chattedUserId, msgId, data }) => {
    //console.log(chattedUserId);
    const user = users.find((user) => user.id === chattedUserId);
    //console.log(user);
    if (user) {
      socket.to(`${user.socketId}`).emit("cancel star", { msgId, data });
    }
  });

  socket.on("delete forAll group", ({ recipients, msgId, data }) => {
    //console.log(recipients);
    let usersToSend = recipients
      .map((rcp) => users.find((usr) => usr.id === rcp._id))
      .filter((el) => el !== undefined);
    //console.log(usersToSend);

    if (usersToSend.length > 0) {
      usersToSend.forEach((user) => {
        socket.to(user.socketId).emit("deleted message", { msgId, data });
      });
    }
  });
  socket.on("delete forAll user", ({ chattedUserId, msgId, data }) => {
    //console.log(chattedUserId);
    const user = users.find((user) => user.id === chattedUserId);
    //console.log(user);
    if (user) {
      socket.to(`${user.socketId}`).emit("deleted message", { msgId, data });
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

  /* Statuses */
  socket.on("new status created", ({ targets, status }) => {
    // console.log(targets);
    let usersToSend = targets
      .map((trg) => users.find((usr) => usr.id === trg._id))
      .filter((el) => el !== undefined);

    if (usersToSend.length > 0) {
      usersToSend.forEach((user) => {
        socket.to(user.socketId).emit("new status created", status);
      });
    }
  });
  socket.on("status deleted", ({ targets, statusId }) => {
    //console.log(targets);
    let usersToSend = targets
      .map((trg) => users.find((usr) => usr.id === trg._id))
      .filter((el) => el !== undefined);

    if (usersToSend.length > 0) {
      usersToSend.forEach((user) => {
        socket.to(user.socketId).emit("status deleted", statusId);
      });
    }
  });
  socket.on("status seen", ({ ownerId, seenBy }) => {
    const user = users.find((user) => user.id === ownerId);
    if (user) {
      io.to(user.socketId).emit("status seen", seenBy);
    }
  });
};
