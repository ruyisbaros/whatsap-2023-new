const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
      text: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email address"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide your password"],
    },
    picture: {
      type: String,
      trim: true,
      default:
        "https://res.cloudinary.com/dmhcnhtng/image/upload/v1643044376/avatars/default_pic_jeaybr.png",
    },
    status: {
      type: String,
      trim: true,
      default: "Hey there! I am using whatsapp",
    },
    lastSeen: String,
  },
  { timestamps: true, collection: "users" }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
const User = mongoose.model("User", userSchema);

module.exports = User;
