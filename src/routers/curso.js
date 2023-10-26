const { Router } = require("express");
const { getAllCourses, getCurso } = require("../controllers/curso");

const router = Router();

router.get("/", getAllCourses);
router.get("/Course/:id", getCurso);

module.exports = router;