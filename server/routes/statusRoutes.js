const router = require("express").Router();
const { protect } = require("../middleware/protect");
const statusCtrl = require("../controllers/statusController");

router.post("/create", protect, statusCtrl.create_status);
router.get("/see/:statusId", protect, statusCtrl.make_seen_status);
router.get("/my_status", protect, statusCtrl.get_my_status);
router.get("/active_sts", protect, statusCtrl.get_active_statuses);
router.get("/delete/:statusId", protect, statusCtrl.delete_status);

module.exports = router;
