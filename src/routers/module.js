const { Router } = require('express');
const { getModule, newModule, getModules, getName, updateModule } = require('../controllers/module');

const router = Router();

router.get('/:id', getModule);
router.post("/newModule", newModule);
router.get("/getModules/:id_curso", getModules);
router.get("/", getName);
router.put("/updateModule", updateModule);

module.exports = router;