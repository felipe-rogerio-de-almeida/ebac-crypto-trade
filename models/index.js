const mongoose = require('mongoose');

const UsuarioSchema = require('./usuario')
const cotacaoSchema = require('./cotacao')
const VariacaoSchema = require('./variacao')

const Usuario = mongoose.model('Usuario', UsuarioSchema);
const Cotacao = mongoose.model('Cotacao', cotacaoSchema);
const Variacao = mongoose.model('Variacao',VariacaoSchema);

const connect = async () => {
  await mongoose.connect(process.env.MONGO_URL);
}

module.exports = {
  connect,
  Usuario,
  Cotacao,
  Variacao,
}
