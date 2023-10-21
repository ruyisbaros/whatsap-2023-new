const router = require("express").Router();
const moment = require("moment");

router.get("/health", (req, res) => {
  res
    .status(200)
    .send(
      `Health: Server instance is running healthy with process id ${
        process.pid
      } on ${moment().format("LL")} `
    );
});

router.get("/env", (req, res) => {
  res.status(200).send(`This is the ${process.env.NODE_ENV} environment`);
});



module.exports = router;
