const { Router } = require("express");
const { newVideo, editVideo } = require("../controllers/video");

const router = Router();

router.post("/newVideo", newVideo);
router.put("/updateVideo", editVideo);

module.exports = router;