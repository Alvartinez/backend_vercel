const { Router } = require('express');
const { getModule } = require('../controllers/module');

const router = Router();

router.get('/:id', getModule);

module.exports = router;