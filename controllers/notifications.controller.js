import { notificationsService } from "../services/index.js";

export async function list(req, res, next) {
    const { id } = req.user
    const response = await notificationsService.list(id)
    res.send({ status: true, content: response })
}

export async function read(req, res, next) {
    const { id } = req.user
    const { notification_id } = req.body
    const response = await notificationsService.read(notification_id, id)
    res.send(response)
}

export async function read_all(req, res, next) {
    const { id } = req.user
    const response = await notificationsService.read_all(id)
    res.send(response)
}

export async function delete_order(req, res, next) {
    const { id } = req.user
    const { notification_id } = req.query
    const response = await notificationsService.delete_notification(notification_id, id)
    res.send(response)
}

export async function delete_all(req, res, next) {
    const { id } = req.user
    const response = await notificationsService.delete_all_notifications(id)
    res.send(response)
}