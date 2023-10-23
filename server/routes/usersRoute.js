const router = require("express").Router();
const { protect } = require("../middleware/protect");
const userCtrl = require("../controllers/usersController");

router.get("/user", protect, userCtrl.findUsers);

module.exports = router;
