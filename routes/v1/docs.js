const swaggerJSDoc = require('swagger-jsdoc');

const swaggerBase = {
    //Por padrão é False e isso faz com que não aparareça tela de erro caso tenha algum erro
    failOnErrors: true,
    openapi: '3.0.0',
    info:{
        title:'API da CryptoTrade',
        description:'Onde trocar cryptos é feito da forma mais facil possivel para você desenvolvedor',
        version:'0.0.1',
    },
    components:{
        securitySchemes:{
            auth:{
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        }
    }
};

const opcoes = {
    definition: swaggerBase,
    apis: ['./routes/v1/*.js']
}

module.exports = swaggerJSDoc(opcoes);