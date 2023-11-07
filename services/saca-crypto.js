const { Usuario } = require("../models");

const sacaCrypto = async(usuario, codigo, valor) => {
    const chamadaDeAtualizacao = await Usuario.updateOne(
        //Parametro 1 o que está buscando
        {
            id: usuario._id,
            moedas: {
                $elemMatch: {       //Agrupa o que está buscando para que atenda varias condições
                    codigo: codigo,
                    quantidade:{
                        $gte: valor,
                    }
                }
            }
        },
        // Parametro 2, o que vai atualizar
        {
            $inc: {         //Incrementa o valor
                'moedas.$.quantidade': -valor,
            }
        }
    );

    if (chamadaDeAtualizacao.matchedCount === 0) {
        throw new Error( 'Você não possui saldo para sacar esse valor!')
    }

    return (await Usuario.findOne({ id: usuario._id})).moedas
};

module.exports = sacaCrypto;