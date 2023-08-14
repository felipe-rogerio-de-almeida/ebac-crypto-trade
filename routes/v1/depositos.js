const express = require('express');

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
        await usuario.save();

        res.json({
            sucesso : true,
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

module.exports = router;
