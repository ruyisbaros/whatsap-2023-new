const router = require("express").Router();
const authCtrl = require("../controllers/authController");
const {
  validateRegister,
  validateLogin,
} = require("../middleware/validChecks");
const { isUserExist } = require("../middleware/isUserExist");
const { protect } = require("../middleware/protect");

router.post("/register", validateRegister, isUserExist, authCtrl.register);
router.post("/login", validateLogin, authCtrl.login);
router.get("/logout", authCtrl.logout);
router.get("/refresh_token", authCtrl.refreshToken);

//Protect test
router.get("/protect_test", protect, async (req, res) => {
  res.send(req.user);
});

module.exports = router;
