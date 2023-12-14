const { Usuario } = require("../../../models");
const { validaOtp } = require("../../../services");


const checaOtp = async (req, res, next) => {
    if (req.isAuthenticated()){
        const usuarioId = req.user._id;

        const usuario = await Usuario.findById(usuarioId).select('segredoOtp')
        const token = req.get('totp')

        if (usuario.segredoOtp && validaOtp(usuario.segredoOtp, token)){
            next()
        } else{
            return res.status(401).json({
                sucesso: false,
                erro: 'OTP inválido ou não configurado! Essa rota necessita da configuração e uso do OTP enviado por headers.'
            })
        }

    } else {    
        return res.status(401).json({
            sucesso:false,
            erro: 'Para prosseguir faça login!',
        });
    };
}


module.exports = { checaOtp }