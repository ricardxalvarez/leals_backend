import joi from 'joi'

export const cancel = {
    body: joi.object().keys({
        ticket_id: joi.string().id().required()
    })
}