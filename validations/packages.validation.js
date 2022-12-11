import joi from "joi";

export const create = {
    body: joi.object().keys({
        usdt_quantity: joi.number().required(),
        available_packages: joi.number().optional(),
        users_to_free_package: joi.number().optional()
    })
}

export const search = {
    query: joi.object().keys({
        idpackage: joi.string().required()
    })
}

export const update = {
    body: joi.object().keys({
        id_package: joi.string().required(),
        usdt_quantity: joi.string().optional(),
        available_packages: joi.number().optional(),
        users_to_free_package: joi.number().optional()
    })
}

export const delete_package = {
    query: joi.object().keys({
        idpackage: joi.string().required()
    })
}