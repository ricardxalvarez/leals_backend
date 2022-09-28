import joi from 'joi'

export const add_balance = {
    body: joi.object().keys({
        userid: joi.string().id().required(),
        amount: joi.number().required()
    })
}

export const approve_advertise = {
    body: joi.object().keys({
        advertise_id: joi.string().id().required()
    })
}