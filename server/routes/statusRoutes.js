const router = require("express").Router();
const { protect } = require("../middleware/protect");
const statusCtrl = require("../controllers/statusController");

router.post("/create", protect, statusCtrl.create_status);
router.get("/see/:statusId", protect, statusCtrl.make_seen_status);

module.exports = router;
