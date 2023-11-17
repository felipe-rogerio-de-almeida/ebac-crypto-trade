const { Schema } = require('mongoose');
const { Usuario } = require('./usuario.js')

const gainers = new Schema({
    usuario: {
        type: Object, // Defina o tipo do campo Usuario aqui
        required: true,
    },
    variacao: {
        type: Number,
        required: true,
    }
});

const loosers = new Schema({
    usuario: {
        type: Object, // Defina o tipo do campo Usuario aqui
        required: true,
    },
    variacao: {
        type: Number,
        required: true,
    }
});

const TopClients = new Schema({
    dia: {
        type: Date,
        required: true,
    },
    gainers: [gainers],
    loosers: [loosers],
});

module.exports = TopClients;