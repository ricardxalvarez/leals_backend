import joi from 'joi'

export const post_advertise = {
    body: joi.object().keys({
        post_link: joi.string().required()
    })
}