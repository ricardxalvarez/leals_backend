import joi from "joi";

export const searchReferral = {
    body: joi.object().keys({
        text: joi.string().optional()
    })
}

export const getReferralChildren = {
    params: joi.object().keys({
        level: joi.string().optional()
    })
}