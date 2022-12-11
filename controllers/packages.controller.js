import { packagesService } from "../services/index.js";
import { StatusCodes } from 'http-status-codes';

export async function create(req, res, next) {
    const response = await packagesService.addPackages(req.body)
    if (!response) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ status: false, content: 'There was an error adding this new package' })
    res.send({ status: true, content: 'New package added successfully!' })
}

export async function list(req, res, next) {
    const response = await packagesService.listPackages()
    return res.send({ status: true, content: response })
}

export async function admin_list(req, res, next) {
    const response = await packagesService.listPackagesAdmin()
    return res.send({ status: true, content: response })
}
export async function search(req, res, next) {
    const { idpackage } = req.query
    const response = await packagesService.searchPackages(idpackage)
    return res.send({ status: true, content: response })
}

export async function update(req, res, next) {
    const { id_package } = req.body
    const response = await packagesService.updatePackages(req.body, id_package)
    return res.send(response)
}

export async function delete_package(req, res, next) {
    const { idpackage } = req.query
    await packagesService.deletePackage(idpackage)
    return res.send({ status: true, content: 'Package deleted successfully' })
}