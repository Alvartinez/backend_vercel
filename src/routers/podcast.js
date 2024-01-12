const { Router } = require("express");
const { newPodcast, editPodcast, getPodcast, deletePodcast } = require("../controllers/podcast");

const router = Router();

router.get("/:id", getPodcast);
router.post("/newPodcast", newPodcast);
router.put("/updatePodcast", editPodcast);
router.delete("/deletePodcast", deletePodcast);

module.exports = router;