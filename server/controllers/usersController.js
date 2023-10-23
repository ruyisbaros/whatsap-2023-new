const User = require("../models/userModel");

const userCtrl = {
  findUsers: async (req, res) => {
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
module.exports = userCtrl;
