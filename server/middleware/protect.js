const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { verifyAccessToken } = require("../utils/createToken");

exports.protect = async (req, res, next) => {
  try {
    const token = req.session.jwt;
    //console.log(req.session)
    if (!token) {
      return res.status(400).json({ message: "You should sign in!" });
    }
    const { id } = await verifyAccessToken(token);
    /* console.log(exp);
    console.log("Now: ", Date.now()); */
    if (!id) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(403).json({ message: "No authorization!" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
