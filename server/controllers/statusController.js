const Status = require("../models/statusModel");
const User = require("../models/userModel");
const { uploadImageToCloduinary } = require("../services/cloudinaryActions");

const statusCtrl = {
  create_status: async (req, res) => {
    try {
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  make_seen_status: async (req, res) => {
    try {
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = statusCtrl;
