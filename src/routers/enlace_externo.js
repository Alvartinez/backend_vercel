const { Router } = require("express");
const { newEnlace } = require("../controllers/enlace_externo");

const router = Router();

router.post("/newEnlace", newEnlace);

module.exports = router;