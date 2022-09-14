import joi from 'joi'

export const search = {
    body: joi.object().keys({
        order_id: joi.string().id().required()
    })
}

export const send_proof = {
    body: joi.object().keys({
        order_id: joi.string().id().required(),
        proof: joi.string().required(),
        id_hash: joi.string().required()
    })
}

export const approve = {
    body: joi.object().keys({
        order_id: joi.string().id().required()
    })
}