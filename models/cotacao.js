const { Schema } = require('mongoose');

const cotacaoSchema = new Schema({
    moeda: {
        type: String,
        required: true,
        min: 3,
    },
    valor: {
        type: Number,
        required: true,
        min: 0,
    },
    data : {
        type: Date,
        required: true,
    },
});

module.exports = cotacaoSchema;