const { Router } = require("express");
const { newSabias, editSabias } = require("../controllers/sabias_que");

const router = Router();

router.post("/newSabia", newSabias);
router.put("/updateSabia", editSabias);

module.exports = router;