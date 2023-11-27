module.exports = {
    criaUsuario : require('./cria-usuario'),
    logaUsuario : require('./loga-usuario'),
    checaSaldo  : require('./checa-saldo'),
    sacaCrypto  : require('./saca-crypto'),
    geraPnl     : require('./gera-pnl'),
    trocaMoedas : require('./troca-moedas'),
    confirmaConta : require('./confirma-conta'),
    buscaCotacoesOnline: require('./busca-cotacoes').buscaCotacoesOnline,
    buscaCotacoesNoBanco: require('./busca-cotacoes').buscaCotacoesNoBanco,
    buscaVariacaoOnline: require('./calcula-variacao').buscaVariacaoOnline,
    buscaVariacoesNoBanco: require('./calcula-variacao').buscaVariacoesNoBanco,
    enviaEmailDeConfirmacao : require('./envia-email').enviaEmailDeConfirmacao,
    enviaEmailDeRecuperacao : require('./envia-email').enviaEmailDeRecuperacao,
    validaTokenAlteracaoDeSenha : require('./valida-token-senha')
};