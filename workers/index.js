const Queue = require('bull');

const cotacoesWorker = require('./cotacoes');
const variacoesWorker = require('./variacoes');

const cotacoesQueue = new Queue('busca-cotacoes', process.env.REDIS_URL);
const variacoesQueue = new Queue('busca-variacao', process.env.REDIS_URL);

cotacoesQueue.process(cotacoesWorker);
variacoesQueue.process(variacoesWorker);


const agendaTarefas = async () => {
    const cotacoesAgendadas = await cotacoesQueue.getRepeatableJobs();
    for (const jobDeBusca of cotacoesAgendadas) {
        await cotacoesQueue.removeRepeatableByKey(jobDeBusca.key);
    }

    cotacoesQueue.add({}, 
        {
            repeat: { cron: '0/15 * * * *' },
            attempts: 3,
            backoff: 5000,
        }
    );

    const variacoesAgendadas = await variacoesQueue.getRepeatableJobs();
    for (const jobDeBusca of variacoesAgendadas) {
        await variacoesQueue.removeRepeatableByKey(jobDeBusca.key);
    }

    variacoesQueue.add({}, 
        {
            repeat: { cron: '59 23 * * *' },
            attempts: 3,
            backoff: 30,
        }
    );   

};

module.exports = {
    agendaTarefas,
}