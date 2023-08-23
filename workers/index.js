const Queue = require('bull');

const cotacoesWorker = require('./cotacoes');

const cotacoesQueue = new Queue('busca-cotacoes', process.env.REDIS_URL);

cotacoesQueue.process(cotacoesWorker);

const agendaTarefas = () => {
    cotacoesQueue.add({}, {repeat: { cron: '0/15 * * * *' }});
};

module.exports = {
    agendaTarefas,
}