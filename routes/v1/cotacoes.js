const express = require('express');

const {buscaCotacoesNoBanco} = require('../../services');
const { logger } = require('../../utils');

const router = express.Router();


/**
 *  @openapi
 *  /v1/cotacoes:
 *   get:
 *      description: Retorna a última cotação válida de cada moeda no nosso sistema
 *      responses: 
 *          200:
 *              description: Recebe uma lista de cotações, atente-se ao id da cotação que será usado depois na troca de moedas
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              successo:
 *                                  type: boolean
 *                                  example: true
 *                              cotacoes:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Cotação'
 *      tags:
 *          - operações
 */




router.get('/', async (_req, res) => {
    try{
        const cotacoes = await buscaCotacoesNoBanco();

        res.json({
            sucesso: true,
            cotacoes,
        });
    } catch (e){
        logger.error(`Erro ao buscar as cotações: ${e.message}`);

        res.status(500).json({
            sucesso: false,
            erro: e.message
        })
    }
})

module.exports = router