import { withdrawalsService } from "../services/index.js";

export async function request_wihtdrawal(req, res, next) {
    const { id } = req.user
    const { amount } = req.body
    const response = await withdrawalsService.request_wihtdrawal(id, amount)
    res.send(response)
}
