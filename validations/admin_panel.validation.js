import joi from 'joi'

export const add_balance = {
    body: joi.object().keys({
        userid: joi.string().id().required(),
        amount: joi.number().required()
    })
}