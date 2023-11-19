const express = require('express');
const { logger } = require('../../utils');
const { checaSaldo, sacaCrypto } = require('../../services');


const router = express.Router();

/**
 *  @openapi
 *  /v1/saques:
 *   get:
 *      description: Consulta os saques do usuario
 *      security: 
 *          - auth: []
 *      responses:
 *          200:
 *              description: Informações dos saques do usuário
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              sucesso:
 *                                  type: boolean
 *                                  example: true
 *                              saques:
 *                                  type: array
 *                                  items:
 *                                       $ref: '#/components/schemas/Saque'
 *          401: 
 *              description: Autorização está faltando ou inválida
 *      tags:
 *          - operações
 */


router.get('/', async (req,res) => {
    res.json({
        sucesso: true,
        saques: req.user.saques,
    });
});


/**
 *  @openapi
 *  /v1/saques:
 *   post:
 *      description: Rota que adiciona um saque
 *      security:
 *          auth: []
 *      requestBody:
 *          description: Informações do saque
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties: 
 *                          valor:
 *                              type: number
 *                              example: 20
 *      responses:
 *          200:
 *              description: Saque efetuado com sucesso
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              sucesso:
 *                                  type: boolean
 *                                  example: true
 *                              saldo: 
 *                                  type: number
 *                                  example: 200
 *                              saques:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Saque'
 *          401:
 *              description: Autorização está faltando ou inválida
 *          422:
 *              description: Saldo insuficiente
 *      tags:
 *         - operações
 */


router.post('/', async (req, res) => {
    const usuario = req.user;

    try{
        const valor = req.body.valor; 
        const saldo = await checaSaldo(usuario);

        if (saldo < valor) {
            throw new Error('Você não possui saldo para sacar esse dinheiro');
        }

        usuario.saques.push({valor: valor, data: new Date()});
        
        const saldoEmMoedas = usuario.moedas.find(m => m.codigo === 'BRL');
        saldoEmMoedas.quantidade -= valor;
        
        await usuario.save();

        res.json({
            sucesso: true,
            saldo: saldo - valor,
            saques: usuario.saques,
        });

        
    }catch (e) {
        logger.error(`Erro no saque: ${e.message}`)

        res.status(422).json({
            sucesso: false,
            error: e.message,
        })
    }

});

/**
 *  @openapi
 *  /v1/saques/{codigo}:
 *   post:
 *      description: Realiza o saque de uma determinada cryptomoeda
 *      security:
 *          - auth: []
 *      parameters:
 *          - in: path
 *            name: codigo
 *            schema:
 *              type: string
 *              example: BTC
 *              required: true
 *              description: Código da moeda que você quer sacar
 *      requestBody:
 *          description: Informe o valor a ser sacado
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          valor:
 *                              type: number
 *                              example: 10
 *      responses:
 *          200:
 *              descrption: Saque de crypto efetuado com sucesso
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              sucesso: 
 *                                  type: boolean
 *                                  example: true
 *                              moedas:
 *                                  type: array
 *                                  items: 
 *                                      $ref: '#/components/schemas/Moeda'
 *          422:
 *              descrption: Você não possui saldo para sacar esse valor
 *      tags:
 *         - operações
 */

router.post('/:codigo', async (req, res) => {
    const usuario = req.user;
    const codigo = req.params.codigo;
    
    try{
        const valor = req.body.valor;
        const moedas = await sacaCrypto(usuario, codigo, valor);

        res.json({
            sucesso: true,
            moedas: moedas,
        });

    }catch(e){
        logger.error(`Erro no saque de Crypto ${e.message}`);
        res.status(422).json({
            sucesso: false,
            error: e.message,
        })

    }
});

module.exports = router