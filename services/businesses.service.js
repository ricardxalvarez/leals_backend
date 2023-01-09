import conexion from '../database/conexion.js'
import cloudinary from '../config/cloudinary.js'
import validate_image from '../utils/validate_image.js'
import crop_image from '../utils/crop_image.js'
import toPublicId from '../utils/cloudinary_to_publicId.js'
import get_value_by_currency from '../utils/get_value_by_currency.js'
import get_currency_by_id from '../utils/get_currency_by_id.js'

export async function add_business(data, userid) {
    const businesses_config = await (await conexion.query('SELECT * FROM businesses_config')).rows[0]
    const data_type = businesses_config.businesses_types_categories.find(object => object.type === data.type)
    if (!data_type) return { status: true, content: `Use a valid type key ${businesses_config.businesses_types_categories}` }
    const is_category_valid = data_type.categories.some(string => string === data.category)
    if (!is_category_valid) return { status: false, content: `Use a valid category according to type ${data_type.categories}` }
    const business_images = []
    for (let i = 0; i < data.business_images.length; i++) {
        const image = data.business_images[i];
        if (!validate_image(image)) {
            return { status: false, content: `${image} is not an image` }
        }
    }
    for (let i = 0; i < data.business_images.length; i++) {
        const image = data.business_images[i];

        const image_url = await (await cloudinary.uploader.upload(image, {
            upload_preset: 'businesses_images'
        })).url
        business_images.push(image_url)
    }
    let business_logo
    if (!validate_image(data.business_logo)) return { status: false, content: 'Business logo is not a real image' }
    const cropped_business_logo = crop_image(data.business_logo)
    business_logo = await (await cloudinary.uploader.upload(cropped_business_logo, {
        upload_preset: 'businesses_logos'
    })).url
    const info = {
        owner: userid,
        address: null,
        business_name: null,
        service_name: null,
        website_url: null,
        facebook_url: null,
        instagram_url: null,
        tiktok_url: null,
        opening_time: null,
        closing_time: null,
        fee_per_hour: null,
        fee_per_kilometer: null,
        driver_name: null,
        registration_number_car: null,
        product_name: null,
        product_price: null,
        ...data,
        business_images,
        business_logo
    }
    const values = [info.owner, info.type, info.category, info.country, info.lat, info.lng, info.number_phone, new Date(), info.business_name, info.service_name, info.description, info.address, info.gift_percentage, info.website_url, info.facebook_url, info.instagram_url, info.tiktok_url, info.opening_time, info.closing_time, info.fee_per_hour, info.fee_per_kilometer, info.driver_name, info.registration_number_car, info.product_name, info.product_price, info.business_images, info.business_logo]
    await conexion.query('INSERT INTO businesses (owner, type, category, country, lat, lng, number_phone, created_at, business_name, service_name, description, address, gift_percentage, website_url, facebook_url, instagram_url, tiktok_url, opening_time, closing_time, fee_per_hour, fee_per_kilometer, driver_name, registration_number_car, product_name, product_price, business_images, business_logo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8 ,$9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)', values)
    return { status: true, content: 'Business successfully created' }
}

export async function list_businesses(filters) {
    let query
    query = Object.entries(filters).map((object, index) => {
        if (!index) {
            return `WHERE ${object[0]} = ${object[1]}`
        }
        return `AND ${object[0]} = ${object[1]}`
    })
    const list = await (await conexion.query('SELECT businesses.*, AVR(businesses_comments.stars) AS starts_average, COUNT(businesses_comments) AS comments_qnty FROM businesses INNER JOIN businesses_comments ON businesses_comments.business_id=businesses.business_id $1 ORDER BY created_at DESC', [query])).rows
    return list
}

export async function get_business(business_id) {
    const business = await (await conexion.query('SELECT businesses.*, usuarios.avatar, usuarios.nombre_usuario, usuarios.payent_methods FROM businesses LEFT JOIN usuarios ON usuarios.id = businesses.owner WHERE business_id=($1) ORDER BY businesses.created_at DESC', [business_id])).rows[0]
    return business

}

export async function post_review(data, userid) {
    const values = [userid, data.business_id, data.comment, data.stars, new Date()]
    const payment_approved = await (await conexion.query('SELECT * FROM business_payments WHERE owner=($1) AND payment_status=($2)', [userid, 'approved'])).rows[0]
    if (!payment_approved) return { status: false, content: 'You need to have a transaction with this seller to leave a review' }
    await conexion.query('INSERT INTO businesses_comments (owner, business_id, comment, stars, created_at) VALUES ($1, $2, $3, $4, $5)', values)
    return { status: true, content: "Review successfully submitted" }
}

export async function list_reviews(business_id) {
    const list = await (await conexion.query('SELECT * FROM businesses_comments WHERE business_id=($1) ORDER BY created_at DESC', [business_id])).rows
    return list
}

export async function list_my_businesses(userid) {
    const list = await (await conexion.query('SELECT * FROM businesses WHERE owner=($1) ORDER BY created_at DESC', [userid])).rows
    return list
}

export async function delete_business(userid, business_id) {
    const business = await (await conexion.query('SELECT * FROM businesses WHERE business_id=($1) AND owner=($2)', [business_id, userid])).rows[0]
    if (!business) return { status: false, content: "Either you are not the onwer of this business or this business does not exist" }
    await conexion.query('DELETE FROM businesse_comments WHERE business_id=(%1)', [business_id])
    await conexion.query('DELETE FROM businesses WHERE business_id=($1)', [business_id])
    return { status: false, content: "Business successfully deleted" }

}

export async function edit_business(userid, data) {
    const businesses_config = await (await conexion.query('SELECT * FROM businesses_config')).rows[0]
    const data_type = businesses_config.businesses_types_categories.find(object => object.type === data.type)
    if (!data_type) return { status: true, content: `Use a valid type key ${businesses_config.businesses_types_categories}` }
    const is_category_valid = data_type.categories.some(string => string === data.category)
    if (!is_category_valid) return { status: false, content: `Use a valid category according to type ${data_type.categories}` }
    const business = await (await conexion.query('SELECT * FROM businesses WHERE business_id=($1) AND owner=($2)', [data.business_id, userid])).rows[0]
    if (!business) return { status: false, content: "Either you are not the onwer of this business or this business does not exist" }
    const business_images = []
    if (data.business_images) {
        for (let i = 0; i < data.business_images.length; i++) {
            const image = data.business_images[i];
            if (!validate_image(image)) {
                return { status: false, content: `${image} is not an image` }
            }
        }
    }
    if (data.business_images?.length < business.business_images) {
        for (let i = 0; i < business.business_images.length; i++) {
            const image = business.business_images[i];
            const new_image = data.business_images[i];

            if (!new_image) {
                await cloudinary.uploader.destroy(toPublicId(image))
                continue;
            }

            if (image !== new_image) {
                await (await cloudinary.uploader.upload(new_image, {
                    public_id: toPublicId(image),
                    upload_preset: 'businesses_images'
                }))
            }

            business_images.push(image)
        }
    } else {
        for (let i = 0; i < data.business_images.length; i++) {
            const new_image = data.business_images[i];
            const image = business.business_images[i];
            if (!image) {
                const new_url = await (await cloudinary.uploader.upload(new_image, {
                    upload_preset: 'businesses_images'
                })).url

                business_images.push(new_url)
                continue;
            }

            if (image !== new_image) {
                await cloudinary.uploader.upload(new_image, {
                    public_id: toPublicId(image),
                    upload_preset: 'businesses_images'
                })
            }

            business_images.push(image)
        }
    }

    if (data.business_logo) {
        if (!validate_image(data.business_logo)) return { status: false, content: 'Business logo is not a real image' }
        const cropped_business_logo = crop_image(data.business_logo)
        await (await cloudinary.uploader.upload(cropped_business_logo, {
            upload_preset: 'businesses_logos',
            public_id: toPublicId(business.business_logo)
        })).url
    }

    const new_info = {
        owner: userid,
        address: null,
        business_name: null,
        service_name: null,
        website_url: null,
        facebook_url: null,
        instagram_url: null,
        tiktok_url: null,
        opening_time: null,
        closing_time: null,
        fee_per_hour: null,
        fee_per_kilometer: null,
        driver_name: null,
        registration_number_car: null,
        product_name: null,
        product_price: null,
        ...business,
        ...data,
        business_images
    }
    const values = [new_info.type, new_info.category, new_info.country, new_info.lat, new_info.lng, new_info.number_phone, new_info.business_name, new_info.service_name, new_info.description, new_info.address, new_info.gift_percentage, new_info.website_url, new_info.facebook_url, new_info.instagram_url, new_info.tiktok_url, new_info.opening_time, new_info.closing_time, new_info.fee_per_hour, new_info.fee_per_kilometer, new_info.driver_name, new_info.registration_number_car, new_info.product_name, new_info.product_name, new_info.product_price, new_info.business_images, new_info.business_logo]
    await conexion.query('UPDATE businesses SET type=($1), category=($2), country=($3), lat=($4), lng=($5), number_phone=($6), business_name=($7), service_name=($8), description=($9), address=($10), gift_percentage=($11), website_url=($12), facebook_url=($13), instagram_url=($14), tiktok_url=($15), opening_time=($16), closing_time=($17), fee_per_hour=($18), fee_per_kilometer=($19), driver_name=($20), registration_number_car=($21), product_name=($22), product_price=($23), business_images=($24), business_logo=($25)', values)
}

export async function search_by_address(address) {
    const list = await (await conexion.query('SELECT * FROM businesses WHERE LOWER(address) LIKE LOWER($1)', [address])).rows
    return list
}

export async function search_by_business_id(data) {
    const business = await (await conexion.query('SELECT businesses.*, usuarios.avatar, usuarios.nombre_usuario, usuarios.payent_methods FROM businesses LEFT JOIN usuarios ON usuarios.id = businesses.owner WHERE business_id=($1) ORDER BY businesses.created_at DESC', [data.business_id])).rows[0]
    if (!business) return { status: false, content: 'There is no business with such id' }
    const currency = get_currency_by_id(data.country)
    const exchange = await get_value_by_currency(currency, data.amount)
    const info = {
        ...business,
        exchange
    }
    return { status: true, content: info }
}

export async function make_payment(data, userid) {
    const business = await (await conexion.query('SELECT * FROM businesses WHERE business_id=($1)', [data.business_id])).rows[0]
    if (!business) return { status: false, content: 'There is no business with such id' }
    if (business.owner === userid) return { status: false, content: 'You cannot make a payment to your own business' }
    if (!validate_image(data.image)) return { status: false, content: 'Image key is not a valid image' }
    const image_url = await (await cloudinary.uploader.upload(data.image, {
        upload_preset: 'businesses_payments_proofs'
    })).url

    const values = [userid, data.business_id, data.id_hash, image_url, data.amount, new Date()]
    await conexion.query('INSERT INTO (owner, business_id, id_hash, image, amount, created_at) VALUES ($1, $2, $3, $4, $5, $6)', values)
    return { status: false, content: 'Payment successfully created' }
}

export async function list_business_history_customer(userid) {
    const list = await (await conexion.query('SELECT business_payments.*, businesses.business_name, businesses.service_name, businesses.product_name FROM business_payments INNER JOIN businesses ON businesses.business_id=business_payments.business_id WHERE business_payments.owner=($1)', [userid])).rows
    return list
}

export async function list_business_history(userid) {
    const list = await (await conexion.query('SELECT business_payments.*, businesses.business_name, businesses.service_name, businesses.product_name FROM business_payments INNER JOIN businesses ON businesses.business_id=business_payments.business_id WHERE businesses.owner=($1)', [userid])).rows
    return list
}

export async function deny_payment(userid, payment_id) {
    const business = await (await conexion.query('SELECT businesses.*, business_payments.business_id, business_payments.payment_id FROM businesses INNER JOIN business_payments ON business_payments.business_id=businesses.business_id WHERE business_payments.payment_id=($1)', [payment_id])).rows[0]
    if (!business) return { status: false, content: 'There is no business refering to this payment' }
    if (business.owner !== userid) return { status: false, content: 'You are not authorized to deny this payment' }

    await conexion.query('UPDATE business_payments SET payment_status=($1) WHERE payment_id=($2)', ['denied', payment_id])
    return { status: true, content: 'Payment successfully denied' }
}

export async function approve_payment(userid, payment_id) {
    const payment = await (await conexion.query('SELECT * FROM business_payments WHERE payment_id=($1)', [payment_id])).rows[0]
    if (!payment) return { status: false, content: 'There is no payment with this payment id' }
    const business = await (await conexion.query('SELECT * FROM businesses WHERE business_id=($1)', [payment.business_id])).rows[0]
    if (!business) return { status: false, content: 'There are no business refering to this payment' }
    if (business.owner !== userid) return { status: false, content: 'You are not authorized to approve this payment' }
    const currency = get_currency_by_id(business.country)
    const exchange = await get_value_by_currency(currency, payment.amount)

    const business_config = await (await conexion.query('SELECT * FROM businesses_config')).rows[0]

    await conexion.query('UPDATE business_payments SET payment_status=($1) WHERE payment_id=($2)', ['approved', payment_id])
    const gift_amount = exchange.LEALS_amount * business.gift_percentage / 100

    const business_owner_wallet = await (await conexion.query('SELECT * FROM wallets WHERE owner=($1)', [business.owner])).rows[0]
    await conexion.query('UPDATE wallets SET balance=($1) WHERE owner=($2)', [business_owner_wallet.balance - gift_amount, business.owner])

    const consumer_commission = gift_amount * business_config.cashback_for_customer / 100
    const leals_cashback = gift_amount * business_config.leals_cashback / 100

    const consumer_wallet = await (await conexion.query('SELECT * FROM wallets WHERE owner=($1)', [payment.owner])).rows[0]
    const leals_wallet = await (await conexion.query('SELECT * FROM wallets WHERE owner=($1)', ['1'])).rows[0]

    await conexion.query('UPDATE wallets SET balance=($1) WHERE owner=($2)', [consumer_wallet.balance + consumer_commission, payment.owner])
    await conexion.query('UPDATE wallets SET balance=($1) WHERE owner=($2)', [leals_wallet + leals_cashback, '1'])

    const parents = []
    while (parents.length < business_config.earnings_by_level) {
        // commmisions are going to parents of seller
        const last_parent_id = parents[parents.length - 1]?.id || payment.owner
        const last_parent = await (await conexion.query('SELECT id, id_sponsor, id_progenitor FROM usuarios WHERE id=($1)', [last_parent_id])).rows[0]
        const parent = await (await conexion.query('SELECT id, id_progenitor FROM usuarios WHERE id=($1)', [last_parent.id_sponsor])).rows[0]
        if (!parent) break;
        parents.push(parent)
    }

    for (let i = 0; i < parents.length; i++) {
        const parent = parents[i];
        const rule = business_config.earnings_by_level.find(object => object.level === i + 1)
        if (!rule) continue;
        const commission = gift_amount * rule.percentage_earnings / 100
        const parent_wallet = await (await conexion.query('SELECT * FROM wallets WHERE owner=($1)', [parent.id])).rows[0]
        await conexion.query('UPDATE wallets SET balance=($1) WHERE owner=($2)', [parent_wallet.balance + commission, parent.id])
    }

    return { status: true, content: "Payment successfully approved" }
}


export async function search_businesses(string) {
    const list = await (await conexion.query("SELECT * FROM businesses WHERE type LIKE '%($1)%' OR category LIKE '%($1)%' OR description '%($1)%' OR address '%($1)%'", [string])).rows
    return list;
}