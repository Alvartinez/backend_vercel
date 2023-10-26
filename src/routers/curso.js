const { Router } = require("express");
const { getAllCourses, getCurso } = require("../controllers/curso");
const { verifyAndRenewToken } = require("../middleware/controlJWT");

const router = Router();

router.get("/", getAllCourses, verifyAndRenewToken);
router.get("/Course/:id", getCurso, verifyAndRenewToken);

module.exports = router;