const { Router } = require("express");
const { getQuiz } = require("../controllers/quiz");
const { getResultsQuiz, resultadoQuiz } = require("../controllers/responseQuiz");

const router = Router();

router.get("/quiz/:id", getQuiz);
router.post("/saveQuiz", resultadoQuiz);
router.get("/", getResultsQuiz);

module.exports = router;