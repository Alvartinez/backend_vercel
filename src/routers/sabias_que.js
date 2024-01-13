const { Router } = require("express");
const { newSabias, editSabias, deleteSabias, getSabias, getSabiasAll } = require("../controllers/sabias_que");

const router = Router();

router.get("/:id", getSabias);
router.get("/sabias/:id", getSabiasAll);
router.post("/newSabia", newSabias);
router.put("/updateSabia", editSabias);
router.delete("/deleteSabia", deleteSabias);

module.exports = router;