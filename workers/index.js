const Queue = require('bull');

const cotacoesWorker = require('./cotacoes');

const cotacoesQueue = new Queue('busca-cotacoes', process.env.REDIS_URL);

cotacoesQueue.process(cotacoesWorker);

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
};

module.exports = {
    agendaTarefas,
}