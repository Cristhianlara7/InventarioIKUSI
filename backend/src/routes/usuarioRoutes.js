const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const auth = require('../middleware/auth');
const verificarRol = require('../middleware/verificarRol');

// Rutas públicas
router.post('/login', usuarioController.login);
router.post('/registro', usuarioController.create);

// Rutas protegidas
router.get('/', auth, verificarRol(['administrador']), usuarioController.getAll);
router.get('/:id', auth, usuarioController.getById);
router.put('/:id', auth, usuarioController.update);
router.delete('/:id', auth, verificarRol(['administrador']), usuarioController.delete);

module.exports = router;