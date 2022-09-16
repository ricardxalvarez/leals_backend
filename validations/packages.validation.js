import joi from "joi";

export const create = {
    body: joi.object().keys({
        leals_quantity: joi.number().required(),
        name: joi.string().required(),
        available_packages: joi.number().optional()
    })
}

export const search = {
    query: joi.object().keys({
        idpackage: joi.string().required()
    })
}

export const update = {
    body: joi.object().keys({
        leals_quantity: joi.string().optional(),
        name: joi.string().optional(),
        available_packages: joi.number().optional()
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