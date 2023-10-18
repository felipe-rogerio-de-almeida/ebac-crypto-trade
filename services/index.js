module.exports = {
    criaUsuario : require('./cria-usuario'),
    logaUsuario : require('./loga-usuario'),
    checaSaldo  : require('./checa-saldo'),
    trocaMoedas : require('./troca-moedas'),
    buscaCotacoesOnline: require('./busca-cotacoes').buscaCotacoesOnline,
    buscaCotacoesNoBanco: require('./busca-cotacoes').buscaCotacoesNoBanco,
    buscaVariacaoOnline: require('./calcula-variacao').buscaVariacaoOnline,
    buscaVariacoesNoBanco: require('./calcula-variacao').buscaVariacoesNoBanco,
};