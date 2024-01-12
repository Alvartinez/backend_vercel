const { Router } = require("express");
const { newLine, getLine, editLine, deleteLine } = require("../controllers/linea_tiempo");

const router = Router();

router.get("/:id", getLine);
router.post("/newLine", newLine);
router.put("/updateLine", editLine);
router.delete("/deleteLine", deleteLine);

module.exports = router;