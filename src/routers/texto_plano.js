const { Router } = require("express");
const { newText, editText } = require("../controllers/texto_plano");

const router = Router();

router.post("/newText", newText);
router.put("/updateText", editText);

module.exports = router;