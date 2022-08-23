import joi from 'joi'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const env = joi.object().keys({
    PORT: joi.number().required(),
    JWT_SECRET: joi.string().required(),
    DB_HOST: joi.string().required(),
    DB_USER: joi.string().required(),
    DB_PASS: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_DATABASE: joi.string().required(),
    AUTH_HOST: joi.string().required(),
    AUTH_PORT: joi.number().required(),
    AUTH_SERVICE: joi.string().required(),
    AUTH_EMAIL: joi.string().required(),
    AUTH_EMAIL_PASS: joi.string().required(),
    AUTH_SECURE: joi.boolean().required(),
    SESSION_SECRET: joi.string().required(),
    TWILIO_ACCOUNT_SID: joi.string().required(),
    TWILIO_AUTH_TOKEN: joi.string().required(),
    TWILIO_PHONE_NUMBER: joi.string().required(),
    // SES_ACCESS_KEY: joi.string().required(),
    // SES_SECRET_KEY: joi.string().required(),
    // SES_REGION: joi.string().required()
})
    .unknown();

const { value, error } = env.validate(process.env)
if (error) {
    console.log(error);
    throw new Error('Config validation error')
}

const vars = {
    jwt: {
        secret: value.JWT_SECRET
    },
    psql: {
        db_host: value.DB_HOST,
        db_user: value.DB_USER,
        db_pass: value.DB_PASS,
        db_port: value.DB_PORT,
        db_databse: value.DB_DATABASE
    },
    email: {
        // name: value.AUTH_HOST,
        // host: value.AUTH_HOST,
        // port: Number(value.AUTH_PORT),
        // service: value.AUTH_SERVICE,
        auth: {
            user: value.AUTH_EMAIL,
            //     pass: value.AUTH_EMAIL_PASS
        },
        // secure: value.AUTH_SECURE
        ses_access_key: value.SES_ACCESS_KEY,
        ses_secret_key: value.SES_SECRET_KEY,
        ses_region: value.SES_REGION
    },
    session: {
        secret: value.SESSION_SECRET
    },
    twilio: {
        account_sid: value.TWILIO_ACCOUNT_SID,
        auth_token: value.TWILIO_AUTH_TOKEN,
        phone_number: value.TWILIO_PHONE_NUMBER
    }
}

export default vars