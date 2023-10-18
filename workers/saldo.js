const { Corretora } = require('../models');
const { CNPJ, RESERVA_MINIMAL } = require('../constants');
const { logger } = require('../utils');

const saldosWorker = async (job, done) => {
    try{
        logger.info(`Checando aumento de saldos... Tentativa ${job.attemptsMade + 1}/${job.opts.attempts}`);
    
        const corretora = await Corretora.finOne({
            cnpj: CNPJ,
        });
    
        if (corretora.caixa < RESERVA_MINIMA){
            corretora.caixa += RESERVA_MINIMA;
        }
    
        await Corretora.save();
    
        logger.info('Reserva atualizada com sucesso');
    
        done();

    } catch (err) {
        logger.error(`Erro ao processar o job ${err.message}`);
        done(err);
    }
}   

module.exports = saldosWorker