import joi from "joi";

export const create = {
    body: joi.object().keys({
        leals_quantity: joi.number().required()
    })
}

export const search = {
    query: joi.object().keys({
        idpackage: joi.string().required()
    })
}

export const update = {
    body: joi.object().keys({
        leals_quantity: joi.string().required()
    }),
    query: joi.object().keys({
        idpackage: joi.string().required()
    })
}

export const delete_package = {
    query: joi.object().keys({
        idpackage: joi.string().required()
    })
}