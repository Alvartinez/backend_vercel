const express = require("express");
const {
  getPerson,
  getPeople,
  newPersona,
  deletePersona,
  changeStatusPersona,
  getPeopleStatus,
  getPeopleRole,
  getUserName,
  getUserNameRol,
  getUserNameStatus,
  getUserRoleStatus,
  getUserComplete,
  updatePersona 
} = require("../controllers/persona");

const router = express.Router();

router.get("/", getPeople);
router.get("/status/:status", getPeopleStatus);
router.get("/role/:role", getPeopleRole);
router.get("/User", getPerson);
router.post("/newUser", newPersona);
router.put("/changeStatusUser", changeStatusPersona);
router.delete("/deleteUser", deletePersona);
router.get("/name/:name", getUserName);
router.get("/name/role", getUserNameRol);
router.get("/name/status", getUserNameStatus);
router.get("/role/status", getUserRoleStatus);
router.get("/userComplete", getUserComplete);
router.put("/updateUser", updatePersona);

module.exports = router;