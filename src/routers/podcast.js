const { Router } = require("express");
const { newPodcast, editPodcast, getPodcast, deletePodcast, getPodcasts } = require("../controllers/podcast");

const router = Router();

router.get("/:id", getPodcast);
router.get("/podcasts/:id", getPodcasts);
router.post("/newPodcast", newPodcast);
router.put("/updatePodcast", editPodcast);
router.delete("/deletePodcast/:id", deletePodcast);

module.exports = router;