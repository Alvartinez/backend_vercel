const { Router } = require("express");
const { newVideo } = require("../controllers/video");
const { editText } = require("../controllers/texto_plano");

const router = Router();

router.post("/newVideo", newVideo);
router.put("/updateVideo", editText);

module.exports = router;