import nodemailer from 'nodemailer'
import config from './config.js'

const smptConfig = {
    host: config.email.host,
    port: config.email.port,
    service: config.email.service,
    auth: {
        user: config.email.auth.user,
        pass: config.email.auth.pass
    },
    secure: config.email.secure
};

console.log(smptConfig)

let transporter = nodemailer.createTransport(smptConfig);

transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Server is ready to take our messages");
    }
});

export default transporter;