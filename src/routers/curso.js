const { Router } = require("express");
const { getAllCourses, getCurso, newCourse, updateCourse, deleteCourse } = require("../controllers/curso");

const router = Router();

router.get("/", getAllCourses);
router.get("/Course/:id", getCurso);
router.post("/newCourse", newCourse);
router.put("/updateCourse", updateCourse);
router.delete("/deleteCourse/:id", deleteCourse);

module.exports = router;