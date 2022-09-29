import { createRequire } from "module";
const require = createRequire(import.meta.url);
const countries = require("../data/contries.json")
function get_countryname_by_id(id) {
    const country = countries.find(object => object.countryCode == id)
    return country?.countryName
}

export default get_countryname_by_id