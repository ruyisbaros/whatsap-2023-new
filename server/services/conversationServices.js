const ConversationModel = require("../models/conversationModel.js");

exports.isConversationExist = async (sId, rId) => {
  let conversation = await ConversationModel.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: sId } } },
      { users: { $elemMatch: { $eq: rId } } },
    ],
  })
    .populate("users", "-password")
    .populate({
      path: "latestMessage",
      model: "Message",
      populate: {
        path: "latestMessage.sender",
        model: "User",
      },
    });

  return conversation[0];
};
