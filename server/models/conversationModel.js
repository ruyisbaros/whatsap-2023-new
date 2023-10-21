const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const conversationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    picture: {
      type: String,
      default:
        "https://res.cloudinary.com/dmhcnhtng/image/upload/v1643044376/avatars/default_pic_jeaybr.png",
    },
    isGroup: {
      type: Boolean,
      required: true,
      default: false,
    },
    users: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: ObjectId,
      ref: "Message",
    },
    admin: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, collection: "conversations" }
);

const ConversationModel = mongoose.model("Conversation", conversationSchema);

module.exports = ConversationModel;
