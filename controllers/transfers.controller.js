import { transfersService } from "../services/index.js";

export async function create_transfer(req, res, next) {
    const { id } = req.user
    const response = await transfersService.create_transfer(id, req.body)
    res.send(response)
}