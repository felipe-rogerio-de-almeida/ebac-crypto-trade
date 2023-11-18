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
        },
        schemas: {
            'Cotação': {
                type: 'object',
                properties: {
                    moedas:{
                        type: 'string',
                        example: 'SOL'
                    },
                    data:{
                        type: 'datetime',
                        example:'2023-10-09-09T16:00:00.398Z'
                    },
                    id:{
                        type: 'string',
                        example: '653183b8471843b2cd3ab62b'
                    },
                    valor:{
                        type: 'number',
                        example: 126.9995276397357
                    }
                }
            }
        }
    }    
};

const opcoes = {
    definition: swaggerBase,
    apis: ['./routes/v1/*.js']
}

module.exports = swaggerJSDoc(opcoes);