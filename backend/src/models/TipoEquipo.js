const mongoose = require('mongoose');

const tipoEquipoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    },
    descripcion: {
        type: String,
        required: false,
        default: 'Sin descripción'
    }
});

module.exports = mongoose.model('TipoEquipo', tipoEquipoSchema);