const express = require('express');
const router = express.Router();
const tipoEquipoController = require('../controllers/tipoEquipoController');

router.get('/', tipoEquipoController.getAll);
router.post('/', tipoEquipoController.create);

module.exports = router;