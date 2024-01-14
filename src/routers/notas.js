const { Router } = require("express");
const { getNota, newNotas, editNotas, deleteNota, getNotasAll } = require("../controllers/notas");

const router = Router();

router.get("/:id", getNota);
router.get("/notas/:id", getNotasAll);
router.post("/newNota", newNotas);
router.put("/updateNota", editNotas);
router.delete("/deleteNota", deleteNota);

module.exports = router;