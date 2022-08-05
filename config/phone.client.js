import twilio from 'twilio'
import config from './config.js';
const accountSid = config.twilio.account_sid;
const authToken = config.twilio.auth_token;
const client = twilio(accountSid, authToken)

client.verify.v2.services('VA8fae577af25bf454192050a0c45af96d')
    .verifications
    .create({ to: config.twilio.phone_number, channel: 'whatsapp' })
    .then(verification => console.log(verification.accountSid));

export default client