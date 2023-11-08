const MessageModel = require("../models/messageModel");
const ConversationModel = require("../models/conversationModel.js");
const User = require("../models/userModel");
const { uploadImageToCloduinary } = require("../services/cloudinaryActions");
const { isConversationExist } = require("../services/conversationServices");

const messageCtrl = {
  send_create_message: async (req, res) => {
    try {
      const my_id = req.user._id;
      const { message, convo_id, recipient, files } = req.body;
      if (!convo_id || (!message && files.length <= 0 && !recipient)) {
        return res.status(500).json({ message: `Something went wrong!` });
      }
      //We will check if it is a first time chat
      let conversations = null;
      const messages = await MessageModel.find({
        conversation: convo_id,
      });

      //1- If there is files first upload them to cloud
      let uploadedFiles = [];
      if (files && files.length > 0) {
        const urls = files.map(async (file) => {
          const res = await uploadImageToCloduinary(
            file.data,
            "whatsapp_api",
            file.type === "IMAGE"
              ? "image"
              : file.type === "VIDEO"
              ? "video"
              : "raw"
          );
          return { ...res, type: file.type };
        });
        uploadedFiles = await Promise.all(urls);
      }
      //2-Create message document in DB
      const createdMessage = await MessageModel.create({
        message,
        sender: my_id,
        recipient,
        conversation: convo_id,
        files: files && files.length > 0 ? uploadedFiles : [],
      });
      //3. Update relevant conversation's latestMessage (each new message will be the latestMessage)
      await ConversationModel.findByIdAndUpdate(convo_id, {
        latestMessage: createdMessage,
      });
      //4. IMPORTANT. if below returns 0 means first time chat started. So
      //we will send conversations only for newly started chats between 2 users. Not always!
      if (messages.length === 0) {
        conversations = await ConversationModel.find({
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
            populate: {
              path: "recipient",
              model: "User",
            },
          })
          .sort({ updatedAt: -1 });
      }
      //5 -Populate newly created message before send
      const populatedMessage = await MessageModel.findById(createdMessage._id)
        .populate("sender", "-password")
        .populate("recipient", "-password")
        .populate({
          path: "conversation",
          model: "Conversation",
          populate: {
            path: "latestMessage",
            model: "Message",
          },
        });
      res.status(201).json({ populatedMessage, conversations });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  send_create_message_group: async (req, res) => {
    try {
      const my_id = req.user._id;
      const { message, convo_id, recipients, files } = req.body;

      //1- If there is files first upload them to cloud
      let uploadedFiles = [];
      if (files && files.length > 0) {
        const urls = files.map(async (file) => {
          const res = await uploadImageToCloduinary(
            file.data,
            "whatsapp_api",
            file.type === "IMAGE"
              ? "image"
              : file.type === "VIDEO"
              ? "video"
              : "raw"
          );
          return { ...res, type: file.type };
        });
        uploadedFiles = await Promise.all(urls);
      }
      //2-Create message document in DB
      const createdMessage = await MessageModel.create({
        message,
        sender: my_id,
        recipients,
        conversation: convo_id,
        files: files && files.length > 0 ? uploadedFiles : [],
      });
      //3. Update relevant conversation's latestMessage (each new message will be the latestMessage)
      await ConversationModel.findByIdAndUpdate(convo_id, {
        latestMessage: createdMessage,
      });

      //4 -Populate newly created message before send
      const populatedMessage = await MessageModel.findById(createdMessage._id)
        .populate("sender", "-password")
        .populate("recipients", "-password")
        .populate({
          path: "conversation",
          model: "Conversation",
          populate: {
            path: "latestMessage",
            model: "Message",
          },
        });
      res.status(201).json({ populatedMessage });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  send_create_message_reply: async (req, res) => {
    try {
      const my_id = req.user._id;
      const { message, convo_id, recipient, files, messageId } = req.body;

      //1- If there is files first upload them to cloud
      let uploadedFiles = [];
      if (files && files.length > 0) {
        const urls = files.map(async (file) => {
          const res = await uploadImageToCloduinary(
            file.data,
            "whatsapp_api",
            file.type === "IMAGE"
              ? "image"
              : file.type === "VIDEO"
              ? "video"
              : "raw"
          );
          return { ...res, type: file.type };
        });
        uploadedFiles = await Promise.all(urls);
      }
      //2-Create message document in DB
      const createdMessage = await MessageModel.create({
        message,
        sender: my_id,
        isReplied: true,
        repliedMessage: messageId,
        recipient,
        conversation: convo_id,
        files: files && files.length > 0 ? uploadedFiles : [],
      });
      //3. Update relevant conversation's latestMessage (each new message will be the latestMessage)
      await ConversationModel.findByIdAndUpdate(convo_id, {
        latestMessage: createdMessage,
      });
      //4 -update and Populate related message before send
      const populatedMessage = await MessageModel.findById(createdMessage._id)
        .populate("sender", "-password")
        .populate("recipient", "-password")
        .populate({
          path: "repliedMessage",
          model: "Message",
          populate: {
            path: "sender",
            model: "User",
          },
        })
        .populate({
          path: "conversation",
          model: "Conversation",
          populate: {
            path: "latestMessage",
            model: "Message",
          },
        });
      res.status(201).json({ populatedMessage });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  send_create_message_group_reply: async (req, res) => {
    try {
      const my_id = req.user._id;
      const { message, convo_id, recipients, files, messageId } = req.body;

      //1- If there is files first upload them to cloud
      let uploadedFiles = [];
      if (files && files.length > 0) {
        const urls = files.map(async (file) => {
          const res = await uploadImageToCloduinary(
            file.data,
            "whatsapp_api",
            file.type === "IMAGE"
              ? "image"
              : file.type === "VIDEO"
              ? "video"
              : "raw"
          );
          return { ...res, type: file.type };
        });
        uploadedFiles = await Promise.all(urls);
      }
      //2-Create message document in DB
      const createdMessage = await MessageModel.create({
        message,
        sender: my_id,
        repliedMessage: messageId,
        isReplied: true,
        recipients,
        conversation: convo_id,
        files: files && files.length > 0 ? uploadedFiles : [],
      });
      //3. Update relevant conversation's latestMessage (each new message will be the latestMessage)
      await ConversationModel.findByIdAndUpdate(convo_id, {
        latestMessage: createdMessage,
      });
      //4 -update and Populate related message before send
      const populatedMessage = await MessageModel.findById(createdMessage._id)
        .populate("sender", "-password")
        .populate("recipients", "-password")
        .populate({
          path: "repliedMessage",
          model: "Message",
          populate: {
            path: "sender",
            model: "User",
          },
        })
        .populate({
          path: "conversation",
          model: "Conversation",
          populate: {
            path: "latestMessage",
            model: "Message",
          },
        });
      res.status(201).json({ populatedMessage });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  send_create_status_reply: async (req, res) => {
    try {
      const my_id = req.user._id;
      const { message, recipient, file } = req.body;
      const exist_conversation = await isConversationExist(my_id, recipient);

      if (!exist_conversation) {
        return;
      }
      //1-Create message document in DB
      const createdMessage = await MessageModel.create({
        message,
        sender: my_id,
        recipient,
        conversation: exist_conversation._id,
        replyFile: file,
      });
      //2. Update relevant conversation's latestMessage (each new message will be the latestMessage)
      await ConversationModel.findByIdAndUpdate(exist_conversation._id, {
        latestMessage: createdMessage,
      });
      //4 -update and Populate related message before send
      const populatedMessage = await MessageModel.findById(createdMessage._id)
        .populate("sender", "-password")
        .populate("recipient", "-password")
        .populate({
          path: "repliedMessage",
          model: "Message",
          populate: {
            path: "sender",
            model: "User",
          },
        })
        .populate({
          path: "conversation",
          model: "Conversation",
          populate: {
            path: "latestMessage",
            model: "Message",
          },
        });
      res.status(201).json({ populatedMessage });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  get_messages: async (req, res) => {
    try {
      const { convId } = req.params;
      if (!convId) {
        return;
      }
      const messages = await MessageModel.find({
        conversation: convId,
      })
        .populate("sender recipient recipients idForDeleted", "-password")
        .populate({
          path: "repliedMessage",
          model: "Message",
          populate: {
            path: "sender",
            model: "User",
          },
        })
        .populate({
          path: "conversation",
          model: "Conversation",
          populate: {
            path: "latestMessage",
            model: "Message",
          },
        });
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  give_star: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedMessage = await MessageModel.findByIdAndUpdate(
        id,
        {
          haveStar: true,
        },
        { new: true }
      )
        .populate("sender recipient recipients idForDeleted", "-password")
        .populate({
          path: "repliedMessage",
          model: "Message",
          populate: {
            path: "sender",
            model: "User",
          },
        })
        .populate({
          path: "conversation",
          model: "Conversation",
          populate: {
            path: "latestMessage",
            model: "Message",
          },
        });
      res.status(201).json(updatedMessage);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  cancel_star: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedMessage = await MessageModel.findByIdAndUpdate(
        id,
        {
          haveStar: false,
        },
        { new: true }
      )
        .populate("sender recipient recipients idForDeleted", "-password")
        .populate({
          path: "repliedMessage",
          model: "Message",
          populate: {
            path: "sender",
            model: "User",
          },
        })
        .populate({
          path: "conversation",
          model: "Conversation",
          populate: {
            path: "latestMessage",
            model: "Message",
          },
        });
      res.status(201).json(updatedMessage);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  delete_for_me: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(500).json({ message: `Something went wrong!` });
      }
      const deletedMessage = await MessageModel.findByIdAndUpdate(
        id,
        { idForDeleted: req.user._id },
        { new: true }
      )
        .populate("sender recipient recipients idForDeleted", "-password")
        .populate({
          path: "repliedMessage",
          model: "Message",
          populate: {
            path: "sender",
            model: "User",
          },
        })
        .populate({
          path: "conversation",
          model: "Conversation",
          populate: {
            path: "latestMessage",
            model: "Message",
          },
        });

      res.status(200).json(deletedMessage);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  delete_for_all: async (req, res) => {
    try {
      const { id, name } = req.body;
      if (!id) {
        return res.status(500).json({ message: `Something went wrong!` });
      }
      const deletedMessage = await MessageModel.findByIdAndUpdate(
        id,
        {
          deleteForAll: true,
          message: `This message was deleted by ${name}`,
        },
        { new: true }
      )
        .populate("sender recipient recipients idForDeleted", "-password")
        .populate({
          path: "repliedMessage",
          model: "Message",
          populate: {
            path: "sender",
            model: "User",
          },
        })
        .populate({
          path: "conversation",
          model: "Conversation",
          populate: {
            path: "latestMessage",
            model: "Message",
          },
        });
      res.status(200).json(deletedMessage);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  add_emoji: async (req, res) => {
    try {
      const { message, emoji } = req.query;
      if (!message || !emoji) {
        return res.status(500).json({ message: `Something went wrong!` });
      }
      const updatedMessage = await MessageModel.findByIdAndUpdate(
        message,
        { $push: { emojiBox: emoji } },
        { new: true }
      )
        .populate("sender recipient recipients idForDeleted", "-password")
        .populate({
          path: "repliedMessage",
          model: "Message",
          populate: {
            path: "sender",
            model: "User",
          },
        })
        .populate({
          path: "conversation",
          model: "Conversation",
          populate: {
            path: "latestMessage",
            model: "Message",
          },
        });
      res.status(200).json(updatedMessage);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  make_seen: async (req, res) => {
    try {
      const { convId } = req.params;
      if (!convId) {
        return;
      }
      const notSeenMessages = await MessageModel.find({
        $and: [
          { whoSaw: { $nin: [req.user._id] } },
          { conversation: { $eq: convId } },
          { sender: { $ne: req.user._id } },
        ],
      })
        .populate("sender recipient recipients idForDeleted", "-password")
        .populate({
          path: "repliedMessage",
          model: "Message",
          populate: {
            path: "sender",
            model: "User",
          },
        })
        .populate({
          path: "conversation",
          model: "Conversation",
          populate: {
            path: "latestMessage",
            model: "Message",
          },
        });
      //console.log(notSeenMessages);
      const promises = notSeenMessages.map(
        async (msg) =>
          await MessageModel.findByIdAndUpdate(msg._id, {
            $push: { whoSaw: req.user._id },
          })
      );
      await Promise.all(promises);
      const messages = await MessageModel.find({
        conversation: convId,
      })
        .populate(
          "sender recipient recipients idForDeleted whoSaw",
          "-password"
        )
        .populate({
          path: "repliedMessage",
          model: "Message",
          populate: {
            path: "sender",
            model: "User",
          },
        })
        .populate({
          path: "conversation",
          model: "Conversation",
          populate: {
            path: "latestMessage",
            model: "Message",
          },
        });
      res.status(200).json({ messages, notSeenMessages });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  make_seen_for_user: async (req, res) => {
    try {
      const { msgId, id } = req.body;
      if (!msgId || !id) {
        return;
      }
      const updatedMessage = await MessageModel.findByIdAndUpdate(
        msgId,
        { $push: { whoSaw: id } },
        { new: true }
      )
        .populate("sender recipient recipients idForDeleted", "-password")
        .populate({
          path: "repliedMessage",
          model: "Message",
          populate: {
            path: "sender",
            model: "User",
          },
        })
        .populate({
          path: "conversation",
          model: "Conversation",
          populate: {
            path: "latestMessage",
            model: "Message",
          },
        });
      res.status(200).json(updatedMessage);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  searchChatUsers: async (req, res) => {
    try {
      const { search } = req.query;
      const users = await User.find({
        $and: [
          { name: { $regex: search, $options: "i" } },
          { _id: { $ne: req.user._id } },
        ],
      }).select("-password");
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = messageCtrl;
