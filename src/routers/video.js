const { Router } = require("express");
const { newVideo, editVideo, getVideo, deleteVideo, getVideos } = require("../controllers/video");

const router = Router();

router.get("/:id", getVideo);
router.get("/videos/:id", getVideos);
router.post("/newVideo", newVideo);
router.put("/updateVideo", editVideo);
router.delete("/deleteVideo", deleteVideo);

module.exports = router;