const express = require('express');

const router = express.Router();
const { enviaEmail } = require('../../services')

/**
* @openapi:
* /v1/status:
*   get:
*     description: Rota de checagem de status
*     responses:
*       200:
*         description: A API está funcional e está tudo certinho! Aproveite!
*/

router.get('/', async (_req, res) => {

  //TO DO: REMOVER
  await enviaEmail.sendMail({
    from: ' "Ebac" <sistemas@ebac.com.br>',
    to: 'usuario-1@exemplo.com, usuario-2@exemplo.com',
    subject: 'Teste de Email :)',
    text: 'Olá mundo!',
    html: '<h1> Olá Mundo! </h1>'
  })

  res.json({
    sucesso: true,
    status: 'ok',
  });
});

module.exports = router;
