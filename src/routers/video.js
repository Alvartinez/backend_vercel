const { Router } = require("express");
const { newVideo } = require("../controllers/video");

const router = Router();

router.post("/newVideo", newVideo);

module.exports = router;