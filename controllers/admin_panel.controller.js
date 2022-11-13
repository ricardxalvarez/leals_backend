import { adminService } from "../services/index.js";

export async function add_balance(req, res, next) {
    const { userid, amount } = req.body
    const response = await adminService.add_balance(userid, amount)
    res.send(response)
}

export async function clean(req, res, next) {
    const response = await adminService.clean()
    res.send(response)
}

export async function approve_advertise(req, res, next) {
    const response = await adminService.approve_advertise(req.body.advertise_id)
    res.send(response)
}

export async function deny_advertise(req, res, next) {
    const response = await adminService.deny_advertise(req.body.advertise_id)
    res.send(response)
}

// advertises

export async function approve_withdrawal(req, res, next) {
    const { withdrawal_id } = req.body
    const response = await adminService.approve_withdrawal(withdrawal_id)
    res.send(response)
}

export async function deny_withdrawal(req, res, next) {
    const { withdrawal_id } = req.body
    const response = await adminService.deny_withdrawal(withdrawal_id)
    res.send(response)
}

export async function list_withdrawals(req, res, next) {
    const withdrawals = await adminService.list_withdrawals()
    res.send({ status: true, content: withdrawals })
}


export async function update_commissions_rules(req, res, next) {
    const { commissions_rules } = req.body
    await adminService.update_rules_ads(commissions_rules)
    res.send({ status: true, content: 'Rules commssions successfully updated' })
}

export async function rules_ads(req, res, next) {
    const { rules_ads } = req.body
    await adminService.update_rules_ads(rules_ads)
    res.send({ status: true, content: 'Rules ads successfully updated' })
}

// get pages

export async function get_home_page(req, res, next) {
    const response = await adminService.get_home_page()
    res.send({ status: true, content: response })
}

export async function get_p2p_settings_page(req, res, next) {
    const response = await adminService.get_p2p_settings_page()
    res.send({ status: true, content: response })
}

export async function get_split_settings_page(req, res, next) {
    const response = await adminService.get_split_settings_page()
    res.send({ status: true, content: response })
}

// export async function 