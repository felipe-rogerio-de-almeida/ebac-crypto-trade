const express = require('express');

const {buscaVariacoesNoBanco} = require('../../services');
const { logger } = require('../../utils');

const router = express.Router();

router.get('/', async (_req, res) => {
    try{
        const variacoes = await buscaVariacoesNoBanco();

        res.json({
            sucesso: true,
            variacoes,
        });
    } catch (e){
        logger.error(`Erro ao calcular variações: ${e.message}`);

        res.status(500).json({
            sucesso: false,
            erro: e.message
        })
    }
})

module.exports = router