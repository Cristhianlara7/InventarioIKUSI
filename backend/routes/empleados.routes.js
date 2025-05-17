const express = require('express');
const router = express.Router();
const Empleado = require('../models/empleado.model');

// Ruta POST para crear empleados
router.post('/', async (req, res) => {
  try {
    const empleado = new Empleado(req.body);
    const nuevoEmpleado = await empleado.save();
    res.status(201).json(nuevoEmpleado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Actualizar empleado
router.put('/:id', async (req, res) => {
  try {
    const empleado = await Empleado.findById(req.params.id);
    if (empleado) {
      empleado.nombres = req.body.nombres || empleado.nombres;
      empleado.apellidos = req.body.apellidos || empleado.apellidos;
      empleado.email = req.body.email || empleado.email;
      empleado.departamento = req.body.departamento || empleado.departamento;
      
      const empleadoActualizado = await empleado.save();
      res.json(empleadoActualizado);
    } else {
      res.status(404).json({ message: 'Empleado no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar empleado
router.delete('/:id', async (req, res) => {
  try {
    const empleado = await Empleado.findById(req.params.id);
    if (empleado) {
      await empleado.remove();
      res.json({ message: 'Empleado eliminado' });
    } else {
      res.status(404).json({ message: 'Empleado no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener todos los empleados
router.get('/', async (req, res) => {
  try {
    const empleados = await Empleado.find();
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;