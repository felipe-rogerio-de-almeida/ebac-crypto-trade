const nodemailer = require('nodemailer');
const ejs = require('ejs');
const jsonWebToken = require('jsonwebtoken')

const { Usuario } = require('../models');



const transporter = nodemailer.createTransport({
    host:  process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false,
});

const enviaEmailDeConfirmacao = async (usuario, urlDeRedirecionamento) => {
    const parametros = {
        nome: usuario.nome,
        linkDeConfirmacao: `${process.env.URL_DA_CRYPTOTRADE}/v1/auth/confirma-conta?token=${usuario.tokenDeConfirmacao}&redirect=${urlDeRedirecionamento}`
    };

    await transporter.sendMail({
        from: '"CryptoTrade" <noreply@cryptotrade.com.br',
        to: usuario.email,
        subject: 'Confirme a sua conta!',
        text: await ejs.renderFile('emails/confirmacao/template.txt', parametros),
        html: await ejs.renderFile('emails/confirmacao/template.html', parametros),
    })
}

const enviaEmailDeRecuperacao = async (email, urlDeRedirecionamento) => {
    if (!urlDeRedirecionamento){
        throw new Error('Deve ser enviado um parâmetro com a URL de redirecionamento no campo reirect');
    }

    if (!email){
        throw new Error('Deve ser enviado um parâmetro com o email que deseja pedir mudança de senha');
    }

    const usuario = await Usuario.findOne({ email });

    if (usuario){
        const token = jsonWebToken.sign(
            { token: usuario.tokenDeRecuperacao},
            process.env.JWT_SECRET_KEY,
            {expiresIn: '5 minutes'},
        )
    }

    const parametros = {
        nome: usuario.nome,
        linkDeRecuperacao: `${process.env.URL_DA_CRYPTOTRADE}/v1/auth/valida-token?token=${token}&redirect=${urlDeRedirecionamento}`,
    }

    await transporter.sendMail({
        from: '"CryptoTrade" <noreply@cryptotrade.com.br>',
        to: usuario.email,
        subject: 'Pedido de recuperação de senha',
        text: await ejs.renderFile('emails/recuperacao-de-senha/template.txt', parametros),
        html: await ejs.renderFile('emails/recuperacao-de-senha/template.html', parametros),

    })
}

const enviaEmailDeParabenizacao = async (usuario, lucro)=>{
    const parametros = {
        nome: usuario.nome,
        pnl: lucro
    }

    await transporter.sendMail({
        from: '"CryptoTrade" <noreply@cryptotrade.com.br>',
        to: usuario.email,
        subject: 'Parabéns! Você lucrou mais de R$1000,00 em trade',
        text: await ejs.renderFile('emails/parabenizacao/template.txt', parametros),
        html: await ejs.renderFile('emails/parabenizacao/template.html', parametros),
    })


}

module.exports = {
    enviaEmailDeConfirmacao,
    enviaEmailDeRecuperacao,
    enviaEmailDeParabenizacao,
}