const { Router } = require("express");
const {newResource, getResource} = require("../controllers/recurso");

const router = Router();

router.get("/", getResource);
router.post("/newResource", newResource);

module.exports = router;