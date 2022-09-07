import joi from "joi";

export const create = {
    body: joi.object().keys({
        package_id: joi.number().required()
    })
}

export const search = {
    body: joi.object().keys({
        ticket_id: joi.number().required()
    })
}