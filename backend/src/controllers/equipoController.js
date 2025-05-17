const Equipo = require('../models/Equipo');

const equipoController = {
    // Obtener todos los equipos (accesible para todos)
    getAll: async (req, res) => {
        try {
            const equipos = await Equipo.find()
                .populate('tipoEquipo')
                .populate('usuarioAsignado');
            res.json(equipos);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Obtener un equipo por ID (accesible para todos)
    getById: async (req, res) => {
        try {
            const equipo = await Equipo.findById(req.params.id)
                .populate('tipoEquipo')
                .populate('usuarioAsignado');
            if (!equipo) {
                return res.status(404).json({ message: 'Equipo no encontrado' });
            }
            res.json(equipo);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Crear un nuevo equipo (solo administradores)
    create: async (req, res) => {
        try {
            const equipo = new Equipo(req.body);
            const nuevoEquipo = await equipo.save();
            res.status(201).json(nuevoEquipo);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Actualizar un equipo (solo administradores)
    update: async (req, res) => {
        try {
            const equipo = await Equipo.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            if (!equipo) {
                return res.status(404).json({ message: 'Equipo no encontrado' });
            }
            res.json(equipo);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Eliminar un equipo (solo administradores)
    delete: async (req, res) => {
        try {
            const equipo = await Equipo.findByIdAndDelete(req.params.id);
            if (!equipo) {
                return res.status(404).json({ message: 'Equipo no encontrado' });
            }
            res.json({ message: 'Equipo eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Búsqueda avanzada de equipos
    buscarEquipos: async (req, res) => {
        try {
            const {
                codigo,
                serial,
                tipoEquipo,
                marca,
                usuarioAsignado,
                estado
            } = req.query;

            let filtro = {};

            // Construir filtro dinámicamente
            if (codigo) filtro.codigo = { $regex: codigo, $options: 'i' };
            if (serial) filtro.serial = { $regex: serial, $options: 'i' };
            if (tipoEquipo) filtro.tipoEquipo = tipoEquipo;
            if (marca) filtro.marca = { $regex: marca, $options: 'i' };
            if (usuarioAsignado === 'asignados') {
                filtro.usuarioAsignado = { $ne: null };
            } else if (usuarioAsignado === 'noAsignados') {
                filtro.usuarioAsignado = null;
            } else if (usuarioAsignado) {
                filtro.usuarioAsignado = usuarioAsignado;
            }

            const equipos = await Equipo.find(filtro)
                .populate('tipoEquipo')
                .populate('usuarioAsignado');

            res.json(equipos);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Obtener estadísticas de equipos
    getEstadisticas: async (req, res) => {
        try {
            const totalEquipos = await Equipo.countDocuments();
            const equiposAsignados = await Equipo.countDocuments({ usuarioAsignado: { $ne: null } });
            const equiposDisponibles = totalEquipos - equiposAsignados;

            const equiposPorTipo = await Equipo.aggregate([
                {
                    $group: {
                        _id: '$tipoEquipo',
                        cantidad: { $sum: 1 }
                    }
                },
                {
                    $lookup: {
                        from: 'tipoequipos',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'tipoEquipo'
                    }
                }
            ]);

            const equiposPorMarca = await Equipo.aggregate([
                {
                    $group: {
                        _id: '$marca',
                        cantidad: { $sum: 1 }
                    }
                }
            ]);

            res.json({
                totalEquipos,
                equiposAsignados,
                equiposDisponibles,
                equiposPorTipo,
                equiposPorMarca
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    asignarEquipo: async (req, res) => {
        try {
            const equipoId = req.params.id;  // Cambiado de req.params.equipoId
            const { usuarioId } = req.body;
    
            if (!equipoId || !usuarioId) {
                return res.status(400).json({
                    message: 'Se requieren el ID del equipo y del usuario'
                });
            }
    
            const equipo = await Equipo.findByIdAndUpdate(
                equipoId,
                { usuarioAsignado: usuarioId },
                { 
                    new: true,
                    runValidators: true 
                }
            ).populate('usuarioAsignado');
    
            if (!equipo) {
                return res.status(404).json({
                    message: 'Equipo no encontrado'
                });
            }
    
            res.json(equipo);
        } catch (error) {
            console.error('Error al asignar equipo:', error);
            res.status(500).json({
                message: 'Error al asignar el equipo',
                error: error.message
            });
        }
    },
    /*asignarUsuario: async (req, res) => {
        try {
            const equipoId = req.params.id;
            const { usuarioId } = req.body;
    
            if (!equipoId || !usuarioId) {
                return res.status(400).json({ 
                    message: 'Se requieren el ID del equipo y del usuario' 
                });
            }
    
            // Actualizar directamente usando findByIdAndUpdate
            const equipoActualizado = await Equipo.findByIdAndUpdate(
                equipoId,
                { usuarioAsignado: usuarioId },
                { 
                    new: true,
                    runValidators: true
                }
            ).populate('tipoEquipo')
              .populate('usuarioAsignado');
    
            if (!equipoActualizado) {
                return res.status(404).json({ 
                    message: 'Equipo no encontrado' 
                });
            }
    
            res.json(equipoActualizado);
        } catch (error) {
            console.error('Error al asignar usuario:', error);
            res.status(500).json({ 
                message: 'Error al asignar el usuario al equipo',
                error: error.message 
            });
        }
    },*/
    
};   

module.exports = equipoController;