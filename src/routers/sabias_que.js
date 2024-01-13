const { Router } = require("express");
const { newSabias, editSabias, deleteSabias, getSabias } = require("../controllers/sabias_que");

const router = Router();

router.get("/:id", getSabias);
router.post("/newSabia", newSabias);
router.put("/updateSabia", editSabias);
router.delete("/deleteSabia", deleteSabias);

module.exports = router;