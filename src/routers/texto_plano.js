const { Router } = require("express");
const { newText, editText, deleteText, getText } = require("../controllers/texto_plano");

const router = Router();

router.get("/:id", getText);
router.post("/newText", newText);
router.put("/updateText", editText);
router.delete("/deleteText", deleteText);
module.exports = router;