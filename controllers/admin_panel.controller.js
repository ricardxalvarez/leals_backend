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