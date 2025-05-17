const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario.model');

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crear nuevo usuario
router.post('/', async (req, res) => {
  const usuario = new Usuario({
    nombre: req.body.nombre,
    email: req.body.email,
    password: req.body.password,
    rol: req.body.rol
  });

  try {
    const nuevoUsuario = await usuario.save();
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Actualizar usuario
router.put('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (usuario) {
      usuario.nombre = req.body.nombre || usuario.nombre;
      usuario.email = req.body.email || usuario.email;
      usuario.rol = req.body.rol || usuario.rol;
      if (req.body.password) {
        usuario.password = req.body.password;
      }
      const usuarioActualizado = await usuario.save();
      res.json(usuarioActualizado);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar usuario
router.delete('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (usuario) {
      await usuario.remove();
      res.json({ message: 'Usuario eliminado' });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;