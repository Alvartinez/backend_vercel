const { Router } = require("express");
const { newEnlace, editEnlace } = require("../controllers/enlace_externo");

const router = Router();

router.post("/newEnlace", newEnlace);
router.put("/updateEnlace", editEnlace);

module.exports = router;