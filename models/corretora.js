const { Schema } = require('mongoose');
const { cnpj } = require('cpf-cnpj-validator');

const CorretoraSchema = new Schema({
    caixa: {
        type: Number,
        required: true,
        min: 0
    },
    cnpj: {
        type: String,
        unique: true,
        required: true,
        validate:{
            validator: (v) => {
                return cnpj.isValid(v);
            },
            message: props => `${props.value} não é um CNPJ válido`
        }
    }
});

module.exports = CorretoraSchema;