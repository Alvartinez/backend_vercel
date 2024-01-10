const { Router } = require('express');
const { getModule, newModule, getModules, getName } = require('../controllers/module');

const router = Router();

router.get('/:id', getModule);
router.post("/newModule", newModule);
router.get("/getModules/:id_curso", getModules);
router.get("/getName/", getName);

module.exports = router;