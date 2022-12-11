import { createRequire } from "module";
const require = createRequire(import.meta.url);
const countries = require("../data/contries.json")
export default function get_currency_by_id(id) {
    const country = countries.find(object => object.countryCode == id)
    return country?.currencyCode || "USD"
}