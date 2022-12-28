import joi from 'joi'

export const add_balance = {
    body: joi.object().keys({
        user_ids: joi.array().required().items(joi.string().id().required()),
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
        status: joi.string().valid('processing', 'denied', 'successful').required()
    })
}

export const handle_switches = {
    body: joi.object().keys({
        query: joi.string().valid('sell', 'buy', 'register').required()
    })
}

const commission_rules_items = joi.object().keys({
    level: joi.number().required(),
    commission: joi.number().required(),
    expected_children_qty: joi.number().required(),
})

export const commissions_rules = {
    body: joi.object().keys({
        new_list: joi.array().required().items(commission_rules_items)
    })
}

const ads_rules_items = joi.object().keys({
    ads_quantity: joi.number().required(),
    percentage: joi.number().required(),
    new_businesses: joi.number().required()
})

export const ads_rules = {
    body: joi.object().keys({
        new_list: joi.array().required().items(ads_rules_items)
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
        status: joi.string().valid('approved', 'denied', 'in review').required()
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
        condition: joi.string().valid('active', 'inactive', 'blocked', 'deleted', 'with buys', 'with sells', 'admins', 'with businesses', 'no businesses').required()
    })
}

export const search_by_username = {
    body: joi.object().keys({
        username: joi.string().trim().required(),
        condition: joi.string().valid('active', 'inactive', 'blocked', 'deleted', 'with buys', 'with sells', 'admins', 'with businesses', 'no businesses').required()
    })
}

export const user_update_info = {
    body: joi.object().keys({
        user_id: joi.string().required(),
        data: joi.object().keys({
            full_nombre: joi.string().optional(),
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

export const list_businesses = {
    body: joi.object().keys({
        business_status: joi.string().valid('in review', 'approved', 'denied').required()
    })
}

export const get_business_info = {
    body: joi.object().keys({
        business_id: joi.string().required()
    })
}

export const approve_business = {
    body: joi.object().keys({
        business_id: joi.string().required()
    })
}

export const deny_business = {
    body: joi.object().keys({
        business_id: joi.string().required()
    })
}

export const search_business_by_username = {
    body: joi.object().keys({
        username: joi.string().trim().required()
    })
}

const earnings_by_level_keys = joi.object().keys({
    level: joi.number().required(),
    percentage_earnings: joi.number().required()
})

const businesses_types_categories_keys = joi.object().keys({
    type: joi.string().trim().required(),
    categories: joi.array().required().items(joi.string().required()),
    max_businesses_per_user: joi.number().required()
})

const businesses_rating_keys = joi.object().keys({
    name: joi.string().trim().required(),
    users_quantity: joi.number().required()
})

export const update_businesses_config = {
    body: joi.object().keys({
        cashback_for_customer: joi.number().min(0).optional(),
        leals_cashback: joi.number().min(0).optional(),
        earnings_by_level: joi.array().optional().items(earnings_by_level_keys),
        commission_businesses_gift: joi.array().optional().items(joi.number().required()),
        businesses_types_categories: joi.array().optional().items(businesses_types_categories_keys),
        businesses_rating: joi.array().optional().items(businesses_rating_keys)
    })
}

export const update_sell_vs_buys = {
    body: joi.object().keys({
        new_amount: joi.number().min(0).required()
    })
}

export const update_p2p_sells_fee = {
    body: joi.object().keys({
        new_amount: joi.number().min(0).required()
    })
}