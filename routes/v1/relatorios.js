const express = require('express');
 
const { geraPnl } = require('../../services')
const { logger } = require('../../utils');

const router = express.Router();

router.get('/pnl', async (req, res) => {
    try{
        const usuarioId = req.user._id;
        const pnl = await geraPnl(usuarioId);

        res.json({
            sucesso: true,
            pnl: pnl,
        });

    } catch(e){
        logger.error(`Erro na geração de relatórios ${e.message}`);

        res.status(504).json({
            sucesso: false,
            erro: e.message,
        })
    }
});

module.exports = router;