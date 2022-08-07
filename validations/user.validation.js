import joi from 'joi'
export const register = {
    body: joi.object().keys({
        fullname: joi.string().trim().required(),
        email: joi.string().email().required(),
        idcountry: joi.string().id().min(2).max(2).required(),
        username: joi.string().required(),
        password1: joi.string().trim().required(),
        referralusername: joi.string().id().required()
    })
}

export const registerCompleted = {
    body: joi.object().keys({
        iduser: joi.string().id().required(),
        skills: joi.string().required().max(50),
        phone: joi.string().required(),
        password2: joi.string().required(),
        avatar: joi.string().optional()
    })
}

export const login = {
    body: joi.object().keys({
        username: joi.string().trim().required(),
        password: joi.string().required()
    })
}

export const loginPassword2 = {
    body: joi.object().keys({
        username: joi.string().id().required(),
        password: joi.string().required()
    })
}

export const updatePass1 = {
    body: joi.object().keys({
        password: joi.string().trim().required(),
        oldPassword: joi.string().trim().required()
    })
}
export const updatePass2 = {
    body: joi.object().keys({
        password: joi.string().trim().required(),
        oldPassword: joi.string().trim().optional()
    })
}

export const updateUser = {
    body: joi.object().keys({
        email: joi.string().email().optional(),
        idcountry: joi.string().trim().max(5).optional(),
        skills: joi.string().trim().max(50).optional(),
        phone: joi.string().trim().optional(),
        fullname: joi.string().trim().optional()
    })
}

export const recoverPassword = {
    body: joi.object().keys({
        email: joi.string().email().required()
    })
}

export const emailVerify = {
    body: joi.object().keys({
        code: joi.string().required(),
    })
}

export const paymentMethods = {
    body: joi.object().keys({
        usd_direction: joi.string().optional(),
        leal_direction: joi.string().optional(),
        payment_methods: joi.array().optional()
    })
}

export const updateAvatar = {
    body: joi.object().keys({
        avatar: joi.string().required()
    })
}