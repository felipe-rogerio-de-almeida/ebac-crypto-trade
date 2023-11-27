const express = require('express');
const passport = require('passport');
const bcrypt = require( 'bcrypt');

const { criaUsuario, checaSaldo } = require('../../services');
const { logger } = require('../../utils');

const router = express.Router();



router.post('/', async (req, res) => {
    const dados = req.body.usuario;
    const urlDeRedirecionamento = req.body.redirect;

    if(!urlDeRedirecionamento){
        return res.status(422).json({
            sucesso: false,
            erro: 'Deve passar um parâmetro redirect para onde o usuário será redirecionado após confirmação!'
        });
    }

    try{
        const usuario = await criaUsuario(dados, urlDeRedirecionamento);

        res.json({
            sucesso: true,
            usuario: usuario,
        });
    }catch (e){
        logger.error(`Erro na criação do usuário ${e.message}` )
        res.status(422).json({
            sucesso: false,
            erro: e.message,
        });
    }
});


//rota que um usuario logado consegue redefinir a propia senha a partir de um jwt valido de usuario:

router.put('/senha', 
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        const { senha } = req.body;

        try{
            const usuario = req.user;

            usuario.senha = await bcrypt.hash(senha,10);
            await usuario.save();

            res.json({
                sucesso: true,
                menssagem: 'Senha alterada com sucesso!'
            })

        } catch (e){
            res.status(422).json({
                sucesso: false,
                erro: e.message,
            })
        }
})


/**
 * @openapi
 * /v1/usuarios/me:
 *  get:
 *      description: Rota que retorna o perfil do usuário
 *      security:
 *          - auth: []
 *      responses:
 *          200:
 *              description: Informações do perfil do usuário
 *          401:
 *              description: Autorização está faltando ou inválida
 *      tags:
 *          - usuario
 */

router.get('/me', passport.authenticate('jwt', { session: false }),
    async (req, res) => {
    res.json({
        sucesso: true,
        usuario: req.user,
        saldo: await checaSaldo(req.user),
    })
})

module.exports = router;