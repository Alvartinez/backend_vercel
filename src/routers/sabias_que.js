const { Router } = require("express");
const { newSabias } = require("../controllers/sabias_que");

const router = Router();

router.post("/newSabia", newSabias);

module.exports = router;