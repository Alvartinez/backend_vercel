const { Router } = require("express");
const {newResource} = require("../controllers/recurso");

const router = Router();

router.get("/newRecourse", newResource);

module.exports = router;