const express = require('express');
const { checaSaldo } = require('../../services')
const { logger } = require('../../utils');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        sucesso : true,
        depositos : req.user.depositos,
    })
});

router.post('/', async (req, res) => {
    const usuario = req.user;

    try{
        const valor = req.body.valor;
        usuario.depositos.push({valor : valor, data : new Date()});

        const saldoEmMoedas = usuario.moedas.find(m => m.codigo === 'BRL');
        if (saldoEmMoedas){
            saldoEmMoedas.quantidade += valor;
        } else {
            usuario.moedas.push({ codigo: 'BRL', quantidade: valor });
        }

        await usuario.save();

        res.json({
            sucesso : true,
            saldo: await checaSaldo(usuario),
            depositos : usuario.depositos
        })
    } catch (e) {
        logger.error(`Erro no depósito: ${e.message}`);

        res.json({
            sucesso : false,
            erro: e.message
        });
    }
});

//Cancelar Depósitos pelo do ID
router.post('/:depositoId/cancelar', async (req, res) => {
    const usuario = req.user;
    try{

        const depositoId = req.params.depositoId;
        const deposito = usuario.depositos.id(depositoId);
        
        if (!deposito){
            res.json({
                sucesso: false,
                error: "Depósito não encontrado."
            });
        }

        deposito.cancelado = true;
        await usuario.save();

        res.json({
            sucesso: true,
            message: "Depósito cancelado com sucesso",
            usuario: usuario,
            saldo: await checaSaldo(usuario),
        });
    } catch (e){
        res.json({
            sucesso: false,
            error: e.message,
        })
    }

})

module.exports = router;
