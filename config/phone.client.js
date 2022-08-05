import twilio from 'twilio'
import config from './config.js';
const accountSid = config.twilio.account_sid;
const authToken = config.twilio.auth_token;
const client = twilio(accountSid, authToken)

export default client