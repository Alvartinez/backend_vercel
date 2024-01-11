const { Router } = require("express");
const { newVideo, editVideo, getVideo } = require("../controllers/video");

const router = Router();

router.get("/:id", getVideo);
router.post("/newVideo", newVideo);
router.put("/updateVideo", editVideo);

module.exports = router;