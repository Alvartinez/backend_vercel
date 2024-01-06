const { Router } = require("express");
const { getAllCourses, getCurso, newCourse } = require("../controllers/curso");

const router = Router();

router.get("/", getAllCourses);
router.get("/Course/:id", getCurso);
router.post("/newCourse", newCourse);

module.exports = router;