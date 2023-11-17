const mongoose = require('mongoose');

const UsuarioSchema = require('./usuario')
const cotacaoSchema = require('./cotacao')
const VariacaoSchema = require('./variacao')
const CorretoraSchema = require('./corretora')
const RelatorioSchema = require('./relatorio')
const TopClientsSchema = require('./topClients')

const Usuario = mongoose.model('Usuario', UsuarioSchema);
const Cotacao = mongoose.model('Cotacao', cotacaoSchema);
const Variacao = mongoose.model('Variacao',VariacaoSchema);
const Corretora = mongoose.model('Corretora',CorretoraSchema);
const Relatorio = mongoose.model('Relatorio',RelatorioSchema);
const TopClients = mongoose.model('TopClients', TopClientsSchema);

const connect = async () => {
  await mongoose.connect(process.env.MONGO_URL);
}

module.exports = {
  connect,
  Usuario,
  Cotacao,
  Variacao,
  Corretora,
  Relatorio,
  TopClients,
}
