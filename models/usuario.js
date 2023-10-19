const { Schema } = require('mongoose');
const { cpf } = require('cpf-cnpj-validator');

const MoedasSchema = new Schema({
    quantidade: {
        type: Number,
        required: true,
    },
    codigo: {
        type: String,
        required: true,
        unique: true, //Cria indice no banco de dados
        sparse: true, //Pode haver valores nullos, e esses não seram indexados
    }
})


const SaqueSchema = new Schema({
    valor:{
        type: Number,
        required: true,
        min: 1,
    },
    data: {
        type: Date,
        required: true,
    },
});

const DepositoSchema = new Schema({
    valor : {
        type: Number,
        required: true,
        min: 100,
    },
    data: {
        type: Date,
        required: true,
    },
    cancelado: {
        type: Boolean,
        required: false,
    },
});

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
    depositos:[DepositoSchema], 
    saques: [SaqueSchema],
    moedas: [MoedasSchema],

});

module.exports = UsuarioSchema;