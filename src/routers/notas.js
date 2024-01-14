const { Router } = require("express");
const { getNota, newNotas, editNotas, deleteNota, getNotasAll } = require("../controllers/notas");

const router = Router();

router.get("/:id", getNota);
router.get("/enlaces/:id", getNotasAll);
router.post("/newEnlace", newNotas);
router.put("/updateEnlace", editNotas);
router.delete("/deleteEnlace", deleteNota);

module.exports = router;