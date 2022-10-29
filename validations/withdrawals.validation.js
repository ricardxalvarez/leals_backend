import joi from joi

export const request_withdrawal = {
    body: joi.object().keys({
        amount: joi.number().min(0)
    })
}