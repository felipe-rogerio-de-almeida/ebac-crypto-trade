const axios = require('axios');
const { Variacao } = require('../models');

const buscaVariacaoOnline = async () => {
    const url = `${process.env.COIN_MARKETCAP_URL}/v2/cryptocurrency/quotes/latest`

    const { data } = await axios.get(url, {
        params: {
            symbol : 'BTC,ETH,BNB,XRP,ADA,SOL',
            convert: 'BRL'

        },
        headers: {
            'X-CMC_PRO_API_KEY': process.env.COIN_MARKETCAP_KEY
        }
    });

    const dataDaCotacao = new Date();
    const info = Object.values(data.data);

    return info.map(([cotacao]) => ({
        moeda: cotacao.symbol,
        Variacao: cotacao.quote.BRL.percent_change_24h,
        data: dataDaCotacao,
    }))
}

const buscaVariacoesNoBanco = async () => {
    return await Variacao.aggregate([
        { "$sort": { "data": -1 }},
        {
            "$group": {
                "_id": { "moeda": "$moeda"},
                "data": { "$first": "$data"},
                "topgainers": { "$first": "$topgainers" },
                "toploosers": { "$first": "$toploosers"},
                "id": { "$first": "$_id"},
            }
        },
        { "$unset": "_id"}
    ]);
};


module.exports = {
    buscaVariacaoOnline,
    buscaVariacoesNoBanco,
}
