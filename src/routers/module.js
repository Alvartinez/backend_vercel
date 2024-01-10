const { Router } = require('express');
const { getModule, newModule, getModules, getModuleName } = require('../controllers/module');

const router = Router();

router.get('/:id', getModule);
router.post("/newModule", newModule);
router.get("/getModules/:id_curso", getModules);
router.get("/getModuleName", getModuleName);

module.exports = router;