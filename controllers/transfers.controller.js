import { transfersService } from "../services/index.js";

export async function create_transfer(req, res, next) {
    const { id, nombre_usuario } = req.user
    const response = await transfersService.create_transfer(id, nombre_usuario, req.body)
    res.send(response)
}