const { Router } = require("express");
const { newVideo, editVideo, getVideo, deleteVideo } = require("../controllers/video");

const router = Router();

router.get("/:id", getVideo);
router.post("/newVideo", newVideo);
router.put("/updateVideo", editVideo);
router.delete("/deleteVideo", deleteVideo);

module.exports = router;