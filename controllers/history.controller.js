import { historyService } from "../services/index.js";

export async function list_history_p2p(req, res, next) {
    const { id } = req.user
    const response = await historyService.list_p2p(id)
    res.send({ status: true, content: response })
}