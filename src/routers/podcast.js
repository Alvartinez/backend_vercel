const { Router } = require("express");
const { newPodcast, editPodcast } = require("../controllers/podcast");

const router = Router();

router.post("/newPodcast", newPodcast);
router.put("/updatePodcast", editPodcast);

module.exports = router;