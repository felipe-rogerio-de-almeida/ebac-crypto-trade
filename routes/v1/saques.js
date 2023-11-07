const express = require('express');
const { logger } = require('../../utils');
const { checaSaldo, sacaCrypto } = require('../../services');


const router = express.Router();

router.get('/', async (req,res) => {
    res.json({
        sucesso: true,
        saques: req.user.saques,
    });
});

router.post('/', async (req, res) => {
    const usuario = req.user;

    try{
        const valor = req.body.valor; 
        const saldo = await checaSaldo(usuario);

        if (saldo < valor) {
            throw new Error('Você não possui saldo para sacar esse dinheiro');
        }

        usuario.saques.push({valor: valor, data: new Date()});
        
        const saldoEmMoedas = usuario.moedas.find(m => m.codigo === 'BRL');
        saldoEmMoedas.quantidade -= valor;
        
        await usuario.save();

        res.json({
            sucesso: true,
            saldo: saldo - valor,
            saques: usuario.saques,
        })
    }catch (e) {
        logger.error(`Erro no saque: ${e.message}`)

        res.status(422).json({
            sucesso: false,
            error: e.message,
        })
    }

});

router.post('/:codigo', async (req, res) => {
    const usuario = req.user;
    const codigo = req.params.codigo;
    
    try{
        const valor = req.body.valor;
        const moedas = await sacaCrypto(usuario, codigo, valor);

        res.json({
            sucesso: true,
            moedas: moedas,
        });

    }catch(e){
        logger.error(`Erro no saque de Crypto ${e.message}`);
        error = e.message;
    }
});

module.exports = router