const express = require('express');

const { trocaMoedas } = require('../../services')
const { logger } = require('../../utils')

const router = express.Router()

/**
 *  @openapi
 *  /v1/trocas:
 *   post:
 *      description: Rota para realizar trocas de moedas
 *      security:
 *          - auth: []
 *      requestBody: 
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          cotacaoId:
 *                              type: string
 *                              example: 65595384957f0983e4fd4d65
 *                          quantidade:
 *                              type: number
 *                              example: 10
 *                          operacao:
 *                              type: string
 *                              example: compra
 *      responses: 
 *          200:
 *              description: Troca efetuda com sucesso
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
 *              description: Erro na troca de Moedas
 *      tags:
 *          - operações
 * 
 */


router.post('/', async(req, res) => {
    try {
        const moedas = await trocaMoedas(
            req.user,
            req.body.cotacaoId,
            req.body.quantidade,
            req.body.operacao,
        );

        res.json({
            sucesso: true,
            moedas: moedas,
        });

    } catch (e) {
        logger.error(`Erro na troca de moedas: ${e.message}`);

        res.status(422).json({
            sucesso: false,
            erro: e.message,
        });
    }

});

module.exports = router;