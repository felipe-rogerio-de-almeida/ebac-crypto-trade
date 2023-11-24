const express = require('express');

const { logger } = require('../../utils');
const { logaUsuario } = require('../../services');

const router = express.Router();

/**
 * @openapi
 * /v1/auth:
 *  post:
 *      description: Rota que autentica o usuário e retorna um JWT
 *      requestBody:
 *          description: Suas informações de login
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                          senha:
 *                              type: string
 *      responses:
 *          200:
 *              description: Request realizado com sucesso e JWT obtido
 *          401:
 *              description: Email ou senha inválidos
 *      tags:
 *          - autenticação
 */

router.post('/', async(req, res) => {
    try{
        const { email , senha } = req.body;

        const jwt = await logaUsuario(email, senha);

        res.status(200).json({
            sucesso: true,
            jwt: jwt,
        })

    }catch (e) {
        logger.error(`Erro na autenticação ${e.message}`);

        if (e.message.match('confirmado')){
            res.status(401).json({
                sucesso: false,
                erro: e.message
            })
        } else{
            
            res.status(401).json({
                sucesso: false,
                erro: "Email ou senha inválidos"
            })
        }

    }

})

module.exports = router;
