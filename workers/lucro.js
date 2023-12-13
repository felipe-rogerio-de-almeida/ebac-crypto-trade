const { Usuario } = require('../models');
const { geraPnl } = require('../services');
const { logger } = require('../utils');


const pnlWorker = async (_, done) =>{
    try {
        logger.info('Buscando todos os usuários da base...')
        
        let temMaisUsuarios = true;
        let skip = 0;

        while (temMaisUsuarios){
            const usuarios = await Usuario.find().skip(skip).limit(10);
        
            if (!usuarios.length){
                temMaisUsuarios = false;
            }

            for(const usuario of usuarios){
                logger.info(`gerando PnL para o usuário ${usuario._id}`);
        
                await geraPnl(usuario._id);
            }
            skip += 10;
        }

    
        logger.info('PnL gerados com sucesso')
        done();

    }catch(err){
        logger.error(`Erro ao proceddar o job ${err.message}`)
        done(err);
    }
}

module.exports = pnlWorker;