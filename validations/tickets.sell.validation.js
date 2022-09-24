import joi from 'joi'

export const create = {
    body: joi.object().keys({
        amount: joi.number().required(),
        id_hash_fee: joi.string().id().optional()
    })
}

export const search = {
    body: joi.object().keys({
        ticket_id: joi.number().required()
    })
}