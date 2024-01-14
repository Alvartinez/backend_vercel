const { Router } = require("express");
const { getNota, newNotas, editNotas, deleteNota } = require("../controllers/notas");

const router = Router();

router.get("/:id", getNota);
router.get("/enlaces/:id", get);
router.post("/newEnlace", newNotas);
router.put("/updateEnlace", editNotas);
router.delete("/deleteEnlace", deleteNota);

module.exports = router;