import twilio from 'twilio'
import config from './config.js';
const accountSid = config.twilio.account_sid;
const authToken = config.twilio.auth_token;
const client = twilio(accountSid, authToken)

client.verify.v2.services('VA9114472e3e2671bd7ee8a59ae5a138d8')
    .verifications
    .create({ to: config.twilio.phone_number, channel: 'whatsapp' })
    .then(verification => console.log(verification.accountSid))
    .catch(error => console.log(error))

export default client