import { createRequire } from "module";
const require = createRequire(import.meta.url);
const countriesList = require("../data/contries.json")
const dialsList = require("../data/dialCodes.json")
import fetch, { Headers } from "node-fetch";

const countries = countriesList.map(object => {
    const newObject = dialsList.find(country => country.code === object.countryCode)
    return { ...object, dialCode: newObject?.dial_code }
})

export const retrieveCountry = (req, res, next) => {
    switch (req.query.find) {
        case 'currencyCode':
        case 'countryName':
        case 'dialCode':
        case 'countryCode': {
            res.send(countries.map(c => c[req.query.find]))
            break;
        };
        default: {
            res.send(countries)
        }
    }
}

export const getCurrencyWithDial = (req, res, next) => {
    console.log(req.query.dialCode)
    const countriesList = countries.filter(object => object.dialCode === '+' + req.query.dialCode)
    console.log(countriesList)
    var myHeaders = new Headers();
    myHeaders.append("apikey", "nx4fRpHqyfycX58eydu8R1qjFQDMJKhK");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders
    };

    fetch(`https://api.apilayer.com/exchangerates_data/latest?base=USD`, requestOptions)
        .then(async result => {
            const rates = await (await result.json()).rates
            const dials = []
            for (let i = 0; i < countriesList.length; i++) {
                const country = countriesList[i];
                dials.push({ ...country, exchangeToUSD: rates[country.currencyCode] })
            }
            res.send(dials)
        })
        .catch(error => res.send(error));
}

export const currencyControl = async (req, res, next) => {
    const currency = req.params.currency
    const amount = parseInt(req.query.amount) || 1
    var myHeaders = new Headers();
    myHeaders.append("apikey", "nx4fRpHqyfycX58eydu8R1qjFQDMJKhK");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders
    };

    fetch(`https://api.apilayer.com/exchangerates_data/latest?base=USD`, requestOptions)
        .then(async result => {
            const rates = await (await result.json()).rates
            const sourceExchange = rates[currency] || 0
            const sourceAmount = sourceExchange * amount
            let response = {
                status: true,
                base: 'USD',
                source: currency,
                sourceExchange: sourceExchange,
                baseAmount: amount,
                sourceAmount
            }
            if (!sourceExchange) {
                response = {
                    status: false,
                    content: 'Currrency not suported'
                }
            }
            res.send(response)
        })
        .catch(error => res.send(error));
}