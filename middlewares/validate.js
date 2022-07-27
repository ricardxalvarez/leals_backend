import joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import pick from '../utils/pick.js'
import ApiError from '../utils/ApiError.js'
const validate = (schema) =>
    (req, res, next) => {
        const validSchema = pick(schema, ["params", "query", "body"])
        const object = pick(req, Object.keys(validSchema))
        const { value, error } = joi
            .compile(validSchema)
            .prefs({ errors: { label: 'key' } })
            .validate(object)
        if (error) {
            const errorMessage = error.details
                .map((details) => details.message)
                .join(", ");
            res.status(StatusCodes.BAD_REQUEST).send(errorMessage)
            return new ApiError(StatusCodes.BAD_REQUEST, errorMessage);
        }
        Object.assign(req, value);
        return next();
    }


export default validate;