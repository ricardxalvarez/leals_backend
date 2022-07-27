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
    SESSION_SECRET: joi.string().required()
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
        name: value.AUTH_HOST,
        host: value.AUTH_HOST,
        port: Number(value.AUTH_PORT),
        service: value.AUTH_SERVICE,
        auth: {
            user: value.AUTH_EMAIL,
            pass: value.AUTH_EMAIL_PASS
        },
        secure: value.AUTH_SECURE
    },
    session: {
        secret: value.SESSION_SECRET
    }
}

export default vars