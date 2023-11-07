const ConversationModel = require("../models/conversationModel.js");
const { isConversationExist } = require("../services/conversationServices.js");
const User = require("../models/userModel");

const conversationCtrl = {
  create_open: async (req, res) => {
    try {
      const sender_id = req.user._id;
      const { receiver_id, isGroup } = req.body;

      if (!isGroup) {
        if (!receiver_id) {
          return;
        }
        const withChatUser = await User.findById(receiver_id);
        if (!withChatUser) {
          return;
        }
        //1.) Check if we have a conversation yet
        const exist_conversation = await isConversationExist(
          sender_id,
          receiver_id
        );
        //2.) If not yet conversation between these users, create it and send back
        if (!exist_conversation) {
          let newConversation = await ConversationModel.create({
            name: withChatUser.name,
            picture: withChatUser.picture,
            isGroup: false,
            users: [sender_id, receiver_id],
          });
          newConversation = await newConversation.populate(
            "users",
            "-password"
          );
          res.status(200).json(newConversation);
          //3.) If has, send it back
        } else {
          res.status(200).json(exist_conversation);
        }
      } else {
        let groupChat = await ConversationModel.findOne({ _id: isGroup })
          .populate("users", "-password")
          .populate("admin", "-password")
          .populate({
            path: "latestMessage",
            model: "Message",
            populate: {
              path: "latestMessage.sender",
              model: "User",
            },
          });
        res.status(200).json(groupChat);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  createGroup: async (req, res) => {
    const admin = req.user._id;
    try {
      const { name, users } = req.body;
      users.push(admin);
      let newGroup = await ConversationModel.create({
        name,
        users,
        admin,
        isGroup: true,
        picture:
          "https://res.cloudinary.com/ruyisbaros/image/upload/v1698082700/whatsapp_api/dgiywxrqj00zgsathzus.png",
      });
      newGroup = await newGroup.populate("users admin", "-password");

      res.status(201).json(newGroup);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getMyConversations: async (req, res) => {
    try {
      let conversations = await ConversationModel.find({
        users: { $elemMatch: { $eq: req.user._id } },
      })
        .populate("users", "-password")
        .populate("admin", "-password")
        .populate({
          path: "latestMessage",
          model: "Message",
          populate: {
            path: "sender",
            model: "User",
          },
        })
        .sort({ updatedAt: -1 });

      res.status(200).json(conversations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = conversationCtrl;
/* 
.populate({
          path: "latestMessage",
          model: "Message",
          populate: {
            path: "latestMessage.sender",
            model: "User",
            select: "-password",
          },
        })
*/
