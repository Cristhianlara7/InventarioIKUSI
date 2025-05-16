const TipoEquipo = require('../models/TipoEquipo');

const tipoEquipoController = {
    getAll: async (req, res) => {
        try {
            const tipos = await TipoEquipo.find();
            res.json(tipos);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    create: async (req, res) => {
        try {
            const tipo = new TipoEquipo(req.body);
            const nuevoTipo = await tipo.save();
            res.status(201).json(nuevoTipo);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

module.exports = tipoEquipoController;