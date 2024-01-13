const { Router } = require("express");
const { newSabias, editSabias, deleteSabias } = require("../controllers/sabias_que");

const router = Router();


router.post("/newSabia", newSabias);
router.put("/updateSabia", editSabias);
router.delete("/deleteSabia", deleteSabias);

module.exports = router;