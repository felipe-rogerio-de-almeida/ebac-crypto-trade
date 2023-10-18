const { Variacao } = require('../models');
const { buscaVariacaoOnline } = require('../services');

const { logger } = require('../utils');


const variacoesWorker = async (job, done) => {
    try {
        logger.info(`Buscando Variações... Tentativa ${job.attemptsMade + 1}/${job.opts.attempts}`);
    
        const cotacoesOnline = await buscaVariacaoOnline();
    
        logger.info('Variações requisitadas com sucesso...');
    
        cotacoesOnline.sort((a, b) => b.Variacao - a.Variacao);

        const topGainers = cotacoesOnline.slice(0, 3);
        const topLoosers = cotacoesOnline.slice(-3).sort((a, b) => a.Variacao - b.Variacao);

        const dataDaVariacao = new Date();
        await Variacao.create({
            data: dataDaVariacao,
            topgainers: topGainers.map(cotacao => ({ moeda: cotacao.moeda, variacao: cotacao.Variacao })),
            toploosers: topLoosers.map(cotacao => ({ moeda: cotacao.moeda, variacao: cotacao.Variacao })),
        });
        
        logger.info('Variações inseridas no banco!')
    
        done();
    }
    catch (err) {
        logger.error(`Erro ao processar o job ${err.message}`);
        done(err);
    }

};

module.exports = variacoesWorker