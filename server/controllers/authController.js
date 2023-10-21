const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const {
  createJsonToken,
  createReFreshToken,
  verifyRefreshToken,
} = require("../utils/createToken");
const { uploadImageToCloduinary } = require("../services/cloudinaryActions");

const authCtrl = {
  register: async (req, res) => {
    try {
      const { name, email, password, picture, status } = req.body;
      let image;
      if (picture) {
        image = await uploadImageToCloduinary(picture, "whatsapp_api", "image");
      }
      const newUser = await User.create({
        name: name.toLowerCase(),
        email: email.toLowerCase(),
        password,
        picture: picture ? image.url : process.env.DEFAULT_PICTURE,
        status: status ? status : process.env.DEFAULT_STATUS,
      });
      const token = await createJsonToken(
        { id: newUser._id, email: newUser.email },
        "1d"
      );
      const refreshToken = await createReFreshToken(
        { id: newUser._id, email: newUser.email },
        "30d"
      );

      req.session = {
        jwtR: refreshToken,
        jwt: token,
      };
      //console.log(req.session);
      //const returnedUser = await User.findById(newUser._id).select("-password");
      res.status(201).json({
        message: "Register success",
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          picture: newUser.picture,
          status: newUser.status,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(500).json({ message: `Wrong credentials!` });
      }
      const passCheck = await bcrypt.compare(password, user.password);
      if (!passCheck) {
        return res.status(500).json({ message: `Wrong credentials!` });
      }
      const token = await createJsonToken(
        { id: user._id, email: user.email },
        "1d"
      );
      const refreshToken = await createReFreshToken(
        { id: user._id, email: user.email },
        "30d"
      );

      req.session = {
        jwtR: refreshToken,
        jwt: token,
      };

      res.status(201).json({
        message: "Login success",
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          picture: user.picture,
          status: user.status,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  logout: async (req, res) => {
    try {
      req.session = {
        jwtR: null,
        jwt: null,
      };
      //console.log(req.session);
      return res.status(200).json({ message: "You have been logged out!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  refreshToken: async (req, res) => {
    try {
      const token = req.session?.jwtR;
      //console.log(req.session, token)
      if (!token)
        return res.status(500).json({ message: "Please login again" });
      const { id } = await verifyRefreshToken(token);
      if (!id) return res.status(500).json({ message: "Please login again" });

      const user = await User.findOne({ _id: id }).select("-password");
      //console.log(user)
      if (!user)
        return res.status(500).json({ message: "Please login again!" });
      //console.log(user)
      const access_token = await createJsonToken(
        { id: user._id, email: user.email },
        "1d"
      );
      req.session = {
        jwtR: token,
        jwt: access_token,
      };
      //console.log(req.session)

      res.status(200).json({
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          picture: user.picture,
          status: user.status,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = authCtrl;

/* exports.dateFormatter = async (user) => {
  await User.findOneAndUpdate(user.id, { lastSeen: dateFormat("longTime") });
}; */
