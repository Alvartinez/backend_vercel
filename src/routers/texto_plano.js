const { Router } = require("express");
const { newText } = require("../controllers/texto_plano");

const router = Router();

router.post("/newText", newText);

module.exports = router;