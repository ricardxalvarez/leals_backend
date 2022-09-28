import { advertisesService } from "../services/index.js";

export async function post_advertise(req, res, next) {
    const { id } = req.user
    const { post_link } = req.body
    const response = await advertisesService.post_advertise(id, post_link)
    res.send(response)
}

export async function list_advertises(req, res, next) {
    const { id } = req.user
    const advertises = await advertisesService.list_advertises(id)
    res.send({ status: true, content: advertises })
}