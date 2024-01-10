const { Router } = require("express");
const {newResource, getResource, getAllResources} = require("../controllers/recurso");

const router = Router();

router.get("/resources/:id", getAllResources);
router.get("/:id", getResource);
router.post("/newResource", newResource);

module.exports = router;