const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const statusSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      trim: true,
    },
    owner: {
      type: ObjectId,
      ref: "User",
    },
    targets: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    seenBy: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    files: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true, collection: "statuses" }
);

const statusModel = mongoose.model("Status", statusSchema);

module.exports = statusModel;
