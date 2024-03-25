const { TAXA_DE_TROCA, CNPJ } = require('../constants');
const { Cotacao, Corretora } = require('../models');

const buscaCotacao = async(cotacaoId) => {
    const cotacao = await Cotacao.findOne({
        _id: cotacaoId,
        data:{
            $gte: new Date((new Date()).valueOf() - 60000 * 15)
        }
    });

    if(!cotacao){
        throw new Error('Cotação inválida ou expirada!');
    }

    return cotacao;

};


const trocaMoedas = async (usuario, cotacaoId, quantidade, operacao) => {
    if(!quantidade || !operacao){
        throw new Error('Você deve informar a quantidade desejada e a operação (compra ou venda) desejada');
    }
    
    //Essa cotação existe?
    const cotacaoValida = await buscaCotacao(cotacaoId);

    // A corretora tem saldo?
    const reaisNecessarios = (cotacaoValida.valor * quantidade);
    const corretora = await Corretora.findOne({ cnpj: CNPJ });
    if (corretora.caixa < reaisNecessarios) {
        throw new Error('Valor muito grande, não temos caixa no momento para essa operação.');
    }

    // o usuario tem saldo para isso?
    const moedaEmReais = usuario.moedas.find(m=> m.codigo === 'BRL');
    const moedaEmCrypto = usuario.moedas.find(m=> m.codigo === cotacaoValida.valor.moeda);
    const taxaCorretora = TAXA_DE_TROCA * quantidade;

    if (operacao === 'compra') {
        if(!moedaEmReais || moedaEmReais.quantidade < reaisNecessarios){
            throw new Error('Você não possui saldo suficiente para essa operação! Deposite mais dinheiro!');
        }

        if (moedaEmCrypto){
            moedaEmCrypto.quantidade += (quantidade - taxaCorretora)
        } else{
            usuario.moedas.push({
                codigo: cotacaoValida.moeda,
                quantidade: quantidade - taxaCorretora
            });
        }

    } else {
        if (!moedaEmCrypto || moedaEmCrypto.quantidade < quantidade) {
            throw new Error('Você não possui saldo suficiente para essa operação! Compre mais cryptos!');
        }

        moedaEmReais.quantidade += (reaisNecessarios - taxaCorretora * cotacaoValida.valor)        
        moedaEmCrypto.quantidade -= quantidade;
    }

    await usuario.save();

    corretora.caixa += taxaCorretora * cotacaoValida.valor
    await corretora.save();

    return usuario.moedas
}

module.exports = trocaMoedas
    