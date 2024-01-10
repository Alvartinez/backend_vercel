const { Router } = require("express");
const {newResource} = require("../controllers/recurso");

const router = Router();

router.post("/", newResource);

module.exports = router;