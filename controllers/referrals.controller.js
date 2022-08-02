import { referralsService } from "../services/index.js"
export async function getReferralChildren(req, res) {
    const iduser = req.user.id_progenitor || req.user.id
    const level = parseInt(req.query.level)
    referralsService.referralChildren({ iduser: iduser, level })
        .then(content => {
            res.send({ status: true, content: content.results, last_level: content.last_level, childs_count: content.childs_count })
        })
        .catch(error => {
            console.log(error)
        })
};

export async function searchReferral(req, res, next) {
    const id_sponsor = req.user.id_sponsor || req.user.id
    referralsService.searchReferral(req.body.text, id_sponsor)
        .then(users => {
            res.send({ status: true, content: users })
        })
        .catch(error => console.log(error))
}