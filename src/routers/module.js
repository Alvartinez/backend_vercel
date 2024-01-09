const { Router } = require('express');
const { getModule, newModule } = require('../controllers/module');

const router = Router();

router.get('/:id', getModule);
router.post("/newModule", newModule);

module.exports = router;