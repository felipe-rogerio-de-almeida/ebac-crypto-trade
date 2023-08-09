const { Schema } = require('mongoose');
const { cpf } = require('cpf-cnpj-validator');

const UsuarioSchema = new Schema({
    nome: {
        type : String,
        required: true,
        min: 4,
    },
    cpf: {
        type : String,
        required: true,
        unique: true,
        validate: { 
            validator: (v) => {
                return cpf.isValid(v);
            },
            message: props =>`${props.value} não é um CPF válido`, 
        },
    },
    email: {
        type : String,
        required: true,
        min: 4,
        unique: true,
        validate: {
            validator : (v) =>{
                return v.match('@');
            },
            message : props => `${props.value} não é um e-mail válido`,
        },   
    },
    senha: {
        type : String,
        required: true,
        select: false, // Does not return this value when using find/select
    },

});

module.exports = UsuarioSchema;