const { Usuario } = require('../models/');

const checaSaldo = async (usuario) => {
    const operacoes = (await Usuario.aggregate([
        {$match: {cpf : usuario.cpf }},
        {
            $project: {
                depositos: {
                    $filter: {
                        input: "$depositos",
                        as: "deposito",
                        cond: { $ne: ["$$deposito.cancelado", true] } // Filtra depósitos não cancelados
                    }
                },
                saques: 1,
            }
        },
        {
            $unwind: {
                path: "$depositos",
                preserveNullAndEmptyArrays : true, 
            }
        },
        {
            $group:{
                _id: "$id",
                depositos: {$sum : "$depositos.valor"},
                saques: {$last: "$saques"},
            }
        },
        {
            $unwind: {
                path: "$saques",
                preserveNullAndEmptyArrays : true, 
            }
        },
        {
            $group:{
                _id: "$id",
                saques: {$sum : "$saques.valor"},
                depositos: {$last : "$depositos"},
            }
        },
    ]))[0];

    return operacoes.depositos - operacoes.saques;
}

module.exports = checaSaldo;