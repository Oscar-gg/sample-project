const nodemailer = require('nodemailer')

const mailConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'robert.roberts2@ethereal.email',
        pass: 'x5sAH9rMFM8MHWMQXP'
    }
}

module.exports = nodemailer.createTransport(mailConfig);