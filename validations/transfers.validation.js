import joi from "joi";

export const create = {
    body: joi.object().keys({
        amount: joi.number().required(),
        destinary: joi.string().required()
    })
}