const express = require('express');
const { checaSaldo } = require('../../services')
const { logger } = require('../../utils');
const { checaOtp } = require('./auth/otp');

const router = express.Router();

/**
 *  @openapi
 *  /v1/depositos:
 *   get:
 *      description: Consulta os depósitos do usuário
 *      security:
 *          - auth: []
 *      responses:
 *          200:
 *              description: Deposito realizado com sucesso
 *              content:
 *                  application/json:
 *                      schema:      
 *                          type: object
 *                          properties:
 *                              sucesso:
 *                                  type: boolean
 *                                  examples: true
 *                              depositos:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Deposito'
 *          401: 
 *              description: Autorização está faltando ou inválida
 *      tags:
 *          - operações
 */


router.get('/', (req, res) => {
    res.json({
        sucesso : true,
        depositos : req.user.depositos,
    })
});


/**
 *  @openapi
 *  /v1/depositos:
 *   post:
 *      description: Realiza um depósito
 *      security:
 *          - auth: []
 *            otp: []
 *      requestBody:
 *          description: Informar o valor do depósito
 *          required: true
 *          content:   
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          valor:
 *                              type: number
 *                              example: 100
 *      responses:
 *          200:
 *              description: Depósito realizado com sucesso
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
 *                                  example: 1000
 *                              depositos:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Deposito'
 *          401:
 *              description: Login não realizado ou OTP inválido
 *      tags:
 *          - operações
 */

router.post('/', checaOtp, async (req, res) => {
    const usuario = req.user;

    try{
        const valor = req.body.valor;
        usuario.depositos.push({valor : valor, data : new Date() });

        const saldoEmMoedas = usuario.moedas.find(m => m.codigo === 'BRL');
        if (saldoEmMoedas){
            saldoEmMoedas.quantidade += valor;
        } else {
            usuario.moedas.push({ codigo: 'BRL', quantidade: valor });
        }

        await usuario.save();

        res.json({
            sucesso : true,
            saldo: await checaSaldo(usuario),
            depositos : usuario.depositos
        })
    } catch (e) {
        logger.error(`Erro no depósito: ${e.message}`);

        res.json({
            sucesso : false,
            erro: e.message
        });
    }
});

/**
 *  @openapi
 *  /v1/depositos/{depositoID}/cancelar:
 *   post:
 *      description: Cancelar um deposito a partir de um ID
 *      security:
 *          - auth: []
 *      parameters:
 *          - in: path
 *            name: depositoID
 *            schema:
 *              type: string
 *              example: 655949e3b458d48a02299c5c
 *              required: true
 *              description: ID do depósito que deve ser cancelado
 *      responses:
 *          200:
 *              description: Depósito cancelado com sucesso
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              sucesso:
 *                                  type: boolean
 *                                  example: true
 *                              message:
 *                                  type: string
 *                                  example: Depósito cancelado com sucesso
 *                              usuario:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Usuario'
 *                              saldo:
 *                                  type: number
 *                                  example: 1000
 *      tags:
 *          - operações
 */

//Cancelar Depósitos pelo do ID
router.post('/:depositoId/cancelar', async (req, res) => {
    const usuario = req.user;
    try{

        const depositoId = req.params.depositoId;
        const deposito = usuario.depositos.id(depositoId);
        
        if (!deposito){
            res.json({
                sucesso: false,
                error: "Depósito não encontrado."
            });
        }

        deposito.cancelado = true;
        await usuario.save();

        res.json({
            sucesso: true,
            message: "Depósito cancelado com sucesso",
            usuario: usuario,
            saldo: await checaSaldo(usuario),
        });
    } catch (e){
        res.json({
            sucesso: false,
            error: e.message,
        })
    }

})

module.exports = router;
