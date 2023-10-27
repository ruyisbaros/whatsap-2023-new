const router = require("express").Router();
const { protect } = require("../middleware/protect");
const messageCtrl = require("../controllers/messageController");

router.post("/send", protect, messageCtrl.send_create_message);
router.post("/send_reply", protect, messageCtrl.send_create_message_reply);
router.post("/send_group", protect, messageCtrl.send_create_message_group);
router.post(
  "/send_group_reply",
  protect,
  messageCtrl.send_create_message_group_reply
);
router.get("/chat_users", protect, messageCtrl.searchChatUsers);
router.get("/get_messages/:convId", protect, messageCtrl.get_messages);
router.get("/make_seen/:convId", protect, messageCtrl.make_seen);
router.get("/delete_for_me/:id", protect, messageCtrl.delete_for_me);
router.get("/give_star/:id", protect, messageCtrl.give_star);
router.get("/cancel_star/:id", protect, messageCtrl.cancel_star);
router.get("/add_emoji", protect, messageCtrl.add_emoji);
module.exports = router;
