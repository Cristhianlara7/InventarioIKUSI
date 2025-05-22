const express = require('express');
const router = express.Router();
const tipoEquipoController = require('../controllers/tipoEquipoController');

router.get('/', tipoEquipoController.getAll);
router.post('/', tipoEquipoController.create);
router.delete('/:id', tipoEquipoController.delete);
router.put('/:id', tipoEquipoController.update);

module.exports = router;