const { Schema } = require('mongoose');

const TopGainersSchema = new Schema({
    moeda : {
        type: String,
        required: true,
        min: 3,
    },
    variacao:{
        type: Number,
        required: true,
    }
});

const TopLoosersSchema = new Schema({
    moeda : {
        type: String,
        required: true,
        min: 3,
    },
    variacao:{
        type: Number,
        required: true,
    }
});

const VariacaoSchema = new Schema({
    data:{
        type: Date,
        required: true,

    },
    topgainers:[TopGainersSchema],
    toploosers:[TopLoosersSchema],
});

module.exports = VariacaoSchema;

