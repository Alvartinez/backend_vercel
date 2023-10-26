const { Router } = require("express");
/* const { changePassword, forgetPassword, LoginPersona } = require("../controllers/auth"); */
const {
     changePassword,
     getPeopleWithCourses, 
     changeRole,
     isRegisteredCourse,
     refreshToken,
    registeredCourse,
     LoginPersona 
    } = require("../controllers/auth");

const router = Router();

router.put("/changePassword", changePassword);
router.post("/login", LoginPersona);
router.get("/getPeople", getPeopleWithCourses);
router.post("/changeRole", changeRole);
router.post("/inscripcion", registeredCourse);
router.get("/inscrito/:idCurso/:idPersona", isRegisteredCourse);
router.post("/refreshToken", refreshToken);

module.exports = router;