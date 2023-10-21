const router = require("express").Router();
const { protect } = require("../middleware/protect");
const conversationCtrl = require("../controllers/conversationController");

router.post("/open_create", protect, conversationCtrl.create_open);
router.get("/my_conversations", protect, conversationCtrl.getMyConversations);

module.exports = router;
