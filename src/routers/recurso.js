const { Router } = require("express");
const {newResource} = require("../controllers/recurso");

const router = Router();

router.post("/newResource", newResource);

module.exports = router;