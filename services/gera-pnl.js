const { Relatorio, Usuario } = require('../models');

const { enviaEmailDeParabenizacao } = require('./envia-email')

const geraPnl = async () => {
    const ontem = new Date()
    ontem.setDate(ontem.getDate() - 1); //Diminui em 1 dia


    const relatorios = await Relatorio.aggregate([
        {
            $match: {
                usuarioId: Usuario._id,
                data: {$gte: ontem}
            }
        },
        { $sort: {data: -1} }
    ]);

    let lucro = 0;
    if (relatorios.length > 1) {
        lucro = relatorios[0].saldo - relatorios[1].saldo;
    } else if (relatorios.length === 1) {
        lucro = relatorios[0].saldo;  // Ajuste conforme a lógica de saldo inicial
    }

    if (lucro >= 1000) {
        const usuario = await Usuario.findById(usuarioId); // Busca o usuário pelo ID
        if (usuario) {
            enviaEmailDeParabenizacao(usuario, lucro);
        }
    }
    
    return lucro;
}

module.exports = geraPnl