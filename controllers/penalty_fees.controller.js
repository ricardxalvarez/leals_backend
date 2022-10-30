export async function get_info(req, res, next) {
    const object = {
        usdt_address_penalty: 'ihq9dbw8iefbioiqwfw',
        amount_penalty: 10,
        usdt_address_fees: 'if9ew89fnbw98ifnb8wne8io'
    }
    res.send({ status: true, content: object })
}