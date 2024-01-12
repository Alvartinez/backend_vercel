const { Router } = require("express");
const { newLine, getLine, editLine, deleteLine } = require("../controllers/linea_tiempo");
const { newHito, editHito, deleteHito, getHito } = require("../controllers/hito");

const router = Router();

//Línea del tiempo
router.get("/:id", getLine);
router.post("/newLine", newLine);
router.put("/updateLine", editLine);
router.delete("/deleteLine", deleteLine); 

//Hito
router.get("/hito/:id", getHito);
router.post("/newHito", newHito);
router.put("/updateHito", editHito);
router.delete("/deleteHito/:id", deleteHito);

module.exports = router;