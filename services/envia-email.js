const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host:  process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false,
});

module.exports = transporter