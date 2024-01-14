const { Router } = require("express");
const { newEnlace, editEnlace, deleteEnlace, getEnlace, getEnlaceAll } = require("../controllers/enlace_externo");

const router = Router();

router.get("/:id", getEnlace);
router.get("/enlaces/:id", getEnlaceAll);
router.post("/newEnlace", newEnlace);
router.put("/updateEnlace", editEnlace);
router.delete("/deleteEnlace", deleteEnlace);

module.exports = router;