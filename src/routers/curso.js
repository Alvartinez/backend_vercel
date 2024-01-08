const { Router } = require("express");
const { getAllCourses, getCurso, newCourse, updateCourse } = require("../controllers/curso");

const router = Router();

router.get("/", getAllCourses);
router.get("/Course/:id", getCurso);
router.post("/newCourse", newCourse);
router.put("/updateCourse", updateCourse);

module.exports = router;