import joi from 'joi'

export const add_balance = {
    body: joi.object().keys({
        userid: joi.string().id().required(),
        amount: joi.number().required()
    })
}

export const approve_advertise = {
    body: joi.object().keys({
        advertise_id: joi.string().id().required()
    })
}

export const approve_withdrawal = {
    body: joi.object().keys({
        withdrawal_id: joi.string().required()
    })
}

export const list_withdrawals = {
    body: joi.object().keys({
        status: joi.string().required()
    })
}

export const handle_switches = {
    body: joi.object().keys({
        query: joi.string().required()
    })
}

export const commissions_rules = {
    body: joi.object().keys({
        new_list: joi.array().required()
    })
}

export const withdrawals_by_requester = {
    body: joi.object().keys({
        username: joi.string().required()
    })
}

export const get_withdrawal = {
    body: joi.object().keys({
        withdrawal_id: joi.string().required()
    })
}

export const list_advertises = {
    body: joi.object().keys({
        status: joi.string().required()
    })
}

export const advertise_info = {
    body: joi.object().keys({
        advertise_id: joi.string().required()
    })
}

export const advertises_by_username = {
    body: joi.object().keys({
        username: joi.string().trim().required()
    })
}

export const update_ads_config = {
    body: joi.object().keys({
        code: joi.string().optional(),
        hashtag: joi.string().optional(),
        time_between_ads: joi.number().optional(),
        facebook_url: joi.string().optional(),
        tiktok_url: joi.string().optional(),
        tutorial_url: joi.string().optional()
    })
}

export const get_team = {
    query: joi.object().keys({
        level: joi.number().optional()
    })
}

export const get_team_by_username = {
    body: joi.object().keys({
        text: joi.string().trim().required()
    })
}

export const list_users = {
    body: joi.object().keys({
        condition: joi.string().required()
    })
}

export const user_update_info = {
    body: joi.object().keys({
        user_id: joi.string().required(),
        data: joi.object().keys({
            full_nombre: joi.string().optional(),
            nombre_usuario: joi.string().optional(),
            email: joi.string().email().optional(),
            usd_direction: joi.string().optional(),
            payment_methods: joi.array().optional(),
            codigo_pais: joi.string().optional(),
            telefono: joi.string().optional(),
            habilidades: joi.string().optional()
        }).required()
    })
}

export const user_info = {
    body: joi.object().keys({
        user_id: joi.string().required()
    })
}

export const block_unblock_buttons = {
    body: joi.object().keys({
        user_id: joi.string().required()
    })
}

export const make_admin = {
    body: joi.object().keys({
        user_id: joi.string().required()
    })
}

export const update_leal_value = {
    body: joi.object().keys({
        new_value: joi.number().required()
    })
}

export const update_split = {
    body: joi.object().keys({
        new_value: joi.number().required()
    })
}

export const update_earnings_stop = {
    body: joi.object().keys({
        new_stop: joi.number().required()
    })
}

export const update_sending_time_hash = {
    body: joi.object().keys({
        new_time: joi.number().required()
    })
}

export const update_wthdrawal_sell_minimun_amount = {
    body: joi.object().keys({
        new_amount: joi.number().required()
    })
}