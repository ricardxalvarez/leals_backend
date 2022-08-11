import { StatusCodes } from "http-status-codes";
import { createRequire } from "module";
const countries = (req, res, next) => {
    const require = createRequire(import.meta.url);
    const countries = require("../data/contries.json")
    if (!req.body.idcountry) return next()
    if (countries.some(c => c.countryCode === req.body.idcountry)) return next()
    else return res.status(StatusCodes.BAD_REQUEST).send({ status: false, content: "This is a not valid id country" })
}

export default countries;