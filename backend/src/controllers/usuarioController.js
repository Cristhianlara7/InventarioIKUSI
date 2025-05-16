const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

const usuarioController = {
    // Obtener todos los usuarios
    getAll: async (req, res) => {
        try {
            const usuarios = await Usuario.find();
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Obtener un usuario por ID
    getById: async (req, res) => {
        try {
            const usuario = await Usuario.findById(req.params.id);
            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            res.json(usuario);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Crear un nuevo usuario
    create: async (req, res) => {
        try {
            const { nombre, email, password, rol } = req.body;

            if (!nombre || !email || !password) {
                return res.status(400).json({ message: 'Por favor complete todos los campos requeridos' });
            }

            const usuarioExistente = await Usuario.findOne({ email });
            if (usuarioExistente) {
                return res.status(400).json({ message: 'Ya existe un usuario con ese email' });
            }

            const usuario = new Usuario({
                nombre,
                email,
                password,
                rol: rol || 'visitante'
            });

            await usuario.save();

            const token = jwt.sign(
                { id: usuario._id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                token,
                usuario: {
                    id: usuario._id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    rol: usuario.rol
                }
            });
        } catch (error) {
            console.error('Error en create:', error);
            res.status(500).json({ message: 'Error en el servidor', error: error.message });
        }
    },

    // Actualizar usuario
    update: async (req, res) => {
        try {
            const { nombre, email, password, rol } = req.body;
            const updates = { nombre, email, rol };
            
            if (password) {
                updates.password = password;
            }

            const usuario = await Usuario.findByIdAndUpdate(
                req.params.id,
                updates,
                { new: true }
            );

            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            res.json(usuario);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Eliminar usuario
    delete: async (req, res) => {
        try {
            const usuario = await Usuario.findByIdAndDelete(req.params.id);
            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            res.json({ message: 'Usuario eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }, // <-- Aquí faltaba la coma

    // Login de usuario
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                return res.status(400).json({ message: 'Por favor proporcione email y contraseña' });
            }

            const usuario = await Usuario.findOne({ email });
            
            if (!usuario) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            const isMatch = await usuario.comparePassword(password);
            
            if (!isMatch) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            const token = jwt.sign(
                { id: usuario._id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                token,
                usuario: {
                    id: usuario._id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    rol: usuario.rol
                }
            });
        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({ message: 'Error en el servidor', error: error.message });
        }
    }
};

module.exports = usuarioController;