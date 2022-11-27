import { adminService } from "../services/index.js";

export async function add_balance(req, res, next) {
    const { userid, amount } = req.body
    const response = await adminService.add_balance(userid, amount)
    res.send(response)
}

export async function decrease_balance(req, res, next) {
    const { userid, amount } = req.body
    const response = await adminService.decrease_balance(userid, amount)
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
    const { status } = req.body
    const withdrawals = await adminService.list_withdrawals(status)
    res.send({ status: true, content: withdrawals })
}

export async function rules_ads(req, res, next) {
    const { new_list } = req.body
    await adminService.update_rules_ads(new_list)
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

export async function handle_switches(req, res, next) {
    const { query } = req.body
    await adminService.handle_switches(query)
    res.send({ status: true, content: 'Option successfully switched' })
}

export async function update_commissions_rules(req, res, next) {
    const { new_list } = req.body
    await adminService.update_commissions_rules(new_list)
    res.send({ status: true, content: 'Commissions rules updated successfully' })
}

export async function update_rules_ads(req, res, next) {
    const { new_list } = req.body
    await adminService.update_rules_ads(new_list)
    res.send({ status: true, content: 'Rules ads updated successfully' })
}

export async function get_withdrawals_by_requester(req, res, next) {
    const { username } = req.body
    const response = await adminService.get_withdrawals_by_requester(username)
    res.send({ status: true, content: response })
}

export async function get_withdrawal_info(req, res, next) {
    const { withdrawal_id } = req.body
    const response = await adminService.get_withdrawal_info(withdrawal_id)
    res.send({ status: true, content: response })
}

export async function list_advertises(req, res, next) {
    const { status } = req.body
    const response = await adminService.list_advertises(status)
    res.send({ status: true, content: response })
}

export async function get_advertise_info(req, res, next) {
    const { advertise_id } = req.body
    const response = await adminService.get_advertise_info(advertise_id)
    res.send({ status: true, content: response })
}

export async function get_advertises_by_username(req, res, next) {
    const { username } = req.body
    const response = await adminService.get_advertises_by_username(username)
    res.send({ status: true, content: response })
}

export async function update_ads_config(req, res, next) {
    await adminService.update_ads_config(req.body)
    res.send({ status: true, content: 'Ads config successfully updated' })
}

export async function get_team(req, res, next) {
    const iduser = req.user.id_progenitor || req.user.id
    const id = req.user.id_progenitor || req.user.id
    const level = parseInt(req.query.level)
    adminService.get_team({ id_progenitor: iduser, level, id })
        .then(content => {
            res.send({ status: true, content: content.results, last_level: content.last_level, childs_count: content.childs_count })
        })
        .catch(error => {
            console.log(error)
        })
}

export async function get_tree_by_username(req, res, next) {
    const id_progenitor = req.user.id_progenitor || req.user.id
    const userid = req.user.id_progenitor || req.user.id
    adminService.get_tree_by_username(req.body.text, id_progenitor, userid)
        .then(content => {
            res.send({ status: content.results.children.length > 0, content: content.results, last_level: content.last_level, childs_count: content.childs_count })
        })
        .catch(error => console.log(error))
}

export async function list_users(req, res, next) {
    const { condition } = req.body
    const response = await adminService.list_users(condition)
    res.send({ status: false, content: response })
}

export async function update_user_info(req, res, mext) {
    const { user_id, data } = req.body
    await adminService.update_user_info(user_id, data)
    res.send({ status: true, content: 'Info of this user was updated successfully' })
}

export async function get_user_info(req, res, next) {
    const { user_id } = req.body
    const response = await adminService.get_user_info(user_id)
    res.send({ status: true, content: response })
}

export async function block_user_buttons(req, res, next) {
    const { user_id } = req.body
    await adminService.block_user_buttons(user_id)
    res.send({ status: true, content: 'Buttons successfully blocked' })
}

export async function unblock_user_buttons(req, res, next) {
    const { user_id } = req.body
    await adminService.unblock_user_buttons(user_id)
    res.send({ status: true, content: 'Buttons successfully unblocked' })
}

export async function make_admin(req, res, next) {
    const { user_id } = req.body
    const response = await adminService.make_admin(user_id)
    res.send(response)
}

export async function update_leal_value(req, res, next) {
    const { new_value } = req.body
    await adminService.update_leal_value(new_value)
    res.send({ status: true, content: 'Value successfully updated' })
}

export async function update_initial_split(req, res, next) {
    const { new_value } = req.body
    await adminService.update_initial_split(new_value)
    res.send({ status: true, content: 'Value successfully updated' })
}

export async function update_earnings_stop(req, res, next) {
    const { new_stop } = req.body
    await adminService.update_earnings_stop(new_stop)
    res.send({ status: true, content: 'New stop successfully updated' })
}

export async function update_sending_time_hash(req, res, next) {
    const { new_time } = req.body
    await adminService.update_sending_time_hash(new_time)
    res.send({ status: true, content: 'New time updated' })
}

export async function update_wthdrawal_sell_minimun_amount(req, res, next) {
    const { new_amount } = req.body
    await adminService.update_wthdrawal_sell_minimun_amount(new_amount)
    res.send({ status: true, content: 'New amount updated' })
}