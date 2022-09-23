import { splitService } from "../services/index.js";

export async function split_info(req, res, next) {
    const { id } = req.user
    const response = await splitService.split_info(id)
    res.send(response)
}