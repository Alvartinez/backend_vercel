const { Router } = require("express");
const { getCompetences, editCompetence, deleteCompetence, newCompetence } = require("../controllers/competencia");


const router = Router();

router.get("/competences/:id", getCompetences);
router.post("/newCompetence", newCompetence);
router.put("/updateCompetence/:id", editCompetence);
router.delete("/deleteCompetence/:id", deleteCompetence);

module.exports = router;