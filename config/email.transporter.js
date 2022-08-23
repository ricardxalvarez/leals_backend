import nodemailer from 'nodemailer'
import config from './config.js'
// import AWS from 'aws-sdk'

// configure AWS SDK
// AWS.config.update({
//     accessKeyId: config.email.ses_access_key,
//     secretAccessKey: config.email.ses_secret_key,
//     region: config.email.ses_region,
// });

// // create Nodemailer SES transporter
// let transporter = nodemailer.createTransport({
//     SES: new AWS.SES({
//         apiVersion: '2010-12-01'
//     })
// });

// // send some mail
// transporter.sendMail({
//     from: 'sender@example.com',
//     to: 'recipient@example.com',
//     subject: 'Message',
//     text: 'I hope this message gets sent!'
// }, (err, info) => {
//     console.log(info.envelope);
//     console.log(info.messageId);
// });
const smptConfig = {
    name: config.email.name,
    host: config.email.host,
    port: config.email.port,
    service: config.email.service,
    auth: {
        user: config.email.auth.user,
        pass: config.email.auth.pass
    },
    secure: config.email.secure
};
// const smptConfig = {
//     SES: new AWS.SES({
//         apiVersion: '2010-12-01'
//     })
// }
let transporter = nodemailer.createTransport(smptConfig);

transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Server is ready to take our messages");
    }
});

export default transporter;