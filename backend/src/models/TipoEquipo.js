const mongoose = require('mongoose');

const tipoEquipoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('TipoEquipo', tipoEquipoSchema);