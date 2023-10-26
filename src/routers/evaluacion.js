const { Router } = require("express");
const { getEvaluacion } = require("../controllers/evaluacion");
const { resultadoEvaluacion, getResultsEvaluation } = require("../controllers/responseEvaluation");

const router = Router();

router.get("/evaluacion/:id", getEvaluacion);
router.post("/saveEvaluation", resultadoEvaluacion);
router.get("/:id", getResultsEvaluation);

module.exports = router;