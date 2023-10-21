const router = require("express").Router();
const { protect } = require("../middleware/protect");
const messageCtrl = require("../controllers/messageController");

router.post("/send", protect, messageCtrl.send_create_message);
router.get("/chat_users", protect, messageCtrl.searchChatUsers);
router.get("/get_messages/:convId", protect, messageCtrl.get_messages);
router.get("/make_seen/:convId", protect, messageCtrl.make_seen);
module.exports = router;
