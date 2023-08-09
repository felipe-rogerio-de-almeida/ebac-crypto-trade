const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { Usuario } = require('../models')

const logaUsuario = async ( email , senha ) => {
    if ( !email || !senha){
        throw new Error ('Campo de senha e email são obrigatórios');
    }

    const usuario = await Usuario.findOne({ email: email }).select('senha');

    if (!usuario) {
        throw new Error ('Usuário não encontrado')
    }

    if (!await bcrypt.compare(senha, usuario.senha)){
        throw new Error ('Senha inválida')
    }

    return jsonwebtoken.sign({ id: usuario._id }, process.env.JWT_SECRET_KEY)
};

module.exports = logaUsuario;