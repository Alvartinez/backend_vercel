const { Router } = require("express");
const { newPodcast } = require("../controllers/podcast");

const router = Router();

router.post("/newPodcast", newPodcast);

module.exports = router;