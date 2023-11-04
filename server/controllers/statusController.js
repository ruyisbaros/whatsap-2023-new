const Status = require("../models/statusModel");
const {
  uploadImageToCloduinary,
  deleteImage,
} = require("../services/cloudinaryActions");

const statusCtrl = {
  create_status: async (req, res) => {
    try {
      const { text, files, targets } = req.body;
      if (files.length === 0) {
        res.status(500).json({ message: "Please add some media fields!" });
      }
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
      const createdStatus = await Status.create({
        owner: req.user._id,
        text,
        targets,
        files: uploadedFiles,
      });
      const populatedStatus = await Status.findById(createdStatus._id).populate(
        "owner targets",
        "-password"
      );
      res.status(201).json(populatedStatus);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  get_my_status: async (req, res) => {
    try {
      let targetStatus = await Status.findOne({ owner: req.user._id }).populate(
        "owner targets seenBy",
        "-password"
      );
      if (!targetStatus) {
        return;
      }
      res.status(201).json(targetStatus);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  make_seen_status: async (req, res) => {
    try {
      const { statusId } = req.params;
      let targetStatus = await Status.findById(statusId);
      if (!targetStatus) {
        return res.status(500).json({ message: "Status time may over!" });
      }
      if (!targetStatus.seenBy.includes(req.user._id)) {
        const updatedStatus = await Status.findByIdAndUpdate(
          targetStatus._id,
          { $push: { seenBy: req.user._id } },
          { new: true }
        ).populate("owner targets seenBy", "-password");
        res.status(201).json(updatedStatus);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  delete_status: async (req, res) => {
    try {
      const { statusId } = req.params;
      if (!statusId) {
        return res.status(500).json({ message: "Wrong credentials!" });
      }
      let targetStatus = await Status.findById(statusId);
      if (!targetStatus) {
        res.status(500).json({ message: "Status time may over!" });
      }
      //First delete related media through cloudinary
      targetStatus.files.map(async (file) => {
        await deleteImage(file.public._id);
      });
      await Status.findByIdAndDelete(statusId);
      res.status(200).json({ message: "ok" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = statusCtrl;
