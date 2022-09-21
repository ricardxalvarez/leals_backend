import joi from 'joi'

export const read = {
    body: joi.object().keys({
        notification_id: joi.string().required()
    })
}

export const delete_order = {
    query: joi.object().keys({
        notification_id: joi.string().required()
    })
}