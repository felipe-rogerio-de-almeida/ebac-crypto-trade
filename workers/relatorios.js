const { Relatorio } = require('../models');
const { checaSaldo } = require('../services');
const { logger } = require('../utils');

const relatorioWorker = async (_, done) =>{
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
                logger.info(`Criando relatório para o usuário ${usuario._id}`);
        
                await Relatorio.create({
                    usuarioId: usuario._id,
                    data: new Date(),
                    saldo: await checaSaldo(usuario),
                });
            }
            skip += 10;
        }

    
        logger.info('Relatórios criados com sucesso')
        done();

    }catch(err){
        log.error(`Erro ao proceddar o job ${err.message}`)
        done(err);
    }
}

module.exports = relatorioWorker;