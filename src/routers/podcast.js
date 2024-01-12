const { Router } = require("express");
const { newPodcast, editPodcast, getPodcast } = require("../controllers/podcast");

const router = Router();

router.get("/:id", getPodcast);
router.post("/newPodcast", newPodcast);
router.put("/updatePodcast", editPodcast);

module.exports = router;