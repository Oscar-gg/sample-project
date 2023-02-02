const nodemailer = require('nodemailer')

const mailConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'kamren63@ethereal.email',
        pass: 'rP1Fx1mPx5GGND6V8d'
    }
}

module.exports = nodemailer.createTransport(mailConfig);