const { Router } = require("express");
const { newLine, getLine, editLine, deleteLine, getLines } = require("../controllers/linea_tiempo");
const { newHito, editHito, deleteHito, getHito, getHitos } = require("../controllers/hito");

const router = Router();

//Línea del tiempo
router.get("/:id", getLine);
router.get("/getLines/:id", getLines);
router.post("/newLine", newLine);
router.put("/updateLine", editLine);
router.delete("/deleteLine/:id", deleteLine); 

//Hito
router.get("/hito/:id", getHito);
router.get("/hitos/:id", getHitos);
router.post("/newHito", newHito);
router.put("/updateHito", editHito);
router.delete("/deleteHito/:id", deleteHito);

module.exports = router;