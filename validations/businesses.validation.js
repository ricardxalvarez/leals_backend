import joi from 'joi'

export const add_business = {
    body: joi.object().keys({
        type: joi.string().lowercase().required(),
        category: joi.string().lowercase().required(),
        country: joi.string().uppercase().required().max(2).min(2),
        number_phone: joi.string().trim().required().regex(/(\+)(297|93|244|1264|358|355|376|971|54|374|1684|1268|61|43|994|257|32|229|226|880|359|973|1242|387|590|375|501|1441|591|55|1246|673|975|267|236|1|61|41|56|86|225|237|243|242|682|57|269|238|506|53|5999|61|1345|357|420|49|253|1767|45|1809|1829|1849|213|593|20|291|212|34|372|251|358|679|500|33|298|691|241|44|995|44|233|350|224|590|220|245|240|30|1473|299|502|594|1671|592|852|504|385|509|36|62|44|91|246|353|98|964|354|972|39|1876|44|962|81|76|77|254|996|855|686|1869|82|383|965|856|961|231|218|1758|423|94|266|370|352|371|853|590|212|377|373|261|960|52|692|389|223|356|95|382|976|1670|258|222|1664|596|230|265|60|262|264|687|227|672|234|505|683|31|47|977|674|64|968|92|507|64|51|63|680|675|48|1787|1939|850|351|595|970|689|974|262|40|7|250|966|249|221|65|500|4779|677|232|503|378|252|508|381|211|239|597|421|386|46|268|1721|248|963|1649|235|228|66|992|690|993|670|676|1868|216|90|688|886|255|256|380|598|1|998|3906698|379|1784|58|1284|1340|84|678|681|685|967|27|260|263)[-](9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{4,20}$/),
        business_name: joi.when('type', { is: 'local', then: joi.string().required().trim() }),
        service_name: joi.when([
            { is: 'local professional', then: joi.string().required().trim() },
            { is: 'mobility', then: joi.string().required().trim() }
        ]),
        description: joi.string().trim().required(),
        address: joi.when('type', [
            { is: 'local', then: joi.string().trim().required() },
            { is: 'local professional', then: joi.string().trim().required() }
        ]),
        gift_percentage: joi.number().required(),
        website_url: joi.string().optional(),
        facebook_url: joi.string().optional(),
        instagram_url: joi.string().optional(),
        tiktok_url: joi.string().optional(),
        opening_time: joi.when('type', { is: 'local', then: joi.string().required().regex(/^([1-9]|0[1-9]|1[0-2]):[0-5][0-9] ([AaPp][Mm])$/) }),
        closing_time: joi.when('type', { is: 'local', then: joi.string().required().regex(/^([1-9]|0[1-9]|1[0-2]):[0-5][0-9] ([AaPp][Mm])$/) }),
        fee_per_hour: joi.when('type', { is: 'local professional', then: joi.number().required() }),
        fee_per_kilometer: joi.when('type', { is: 'mobility', then: joi.number().required() }),
        driver_name: joi.when('type', { is: 'mobility', then: joi.string().trim().required() }),
        registration_number_car: joi.when('type', { is: 'mobility', then: joi.string().trim().required() }),
        product_name: joi.when('type', { is: 'buy s/p', then: joi.string().trim().required() }),
        product_price: joi.when('type', { is: 'buy s/p', then: joi.string().trim().required() }),
        business_images: joi.array().min(1).max(5).required().items(joi.string().required()),
        business_logo: joi.string().required(),
        lat: joi.string().regex(/^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/).required(),
        lng: joi.string().regex(/^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/).required(),
    })
}

export const edit_business = {
    body: joi.object().keys({
        type: joi.string().lowercase().optional(),
        category: joi.string().lowercase().optional(),
        country: joi.string().uppercase().optional().max(2).min(2),
        number_phone: joi.string().trim().optional().regex(/(\+)(297|93|244|1264|358|355|376|971|54|374|1684|1268|61|43|994|257|32|229|226|880|359|973|1242|387|590|375|501|1441|591|55|1246|673|975|267|236|1|61|41|56|86|225|237|243|242|682|57|269|238|506|53|5999|61|1345|357|420|49|253|1767|45|1809|1829|1849|213|593|20|291|212|34|372|251|358|679|500|33|298|691|241|44|995|44|233|350|224|590|220|245|240|30|1473|299|502|594|1671|592|852|504|385|509|36|62|44|91|246|353|98|964|354|972|39|1876|44|962|81|76|77|254|996|855|686|1869|82|383|965|856|961|231|218|1758|423|94|266|370|352|371|853|590|212|377|373|261|960|52|692|389|223|356|95|382|976|1670|258|222|1664|596|230|265|60|262|264|687|227|672|234|505|683|31|47|977|674|64|968|92|507|64|51|63|680|675|48|1787|1939|850|351|595|970|689|974|262|40|7|250|966|249|221|65|500|4779|677|232|503|378|252|508|381|211|239|597|421|386|46|268|1721|248|963|1649|235|228|66|992|690|993|670|676|1868|216|90|688|886|255|256|380|598|1|998|3906698|379|1784|58|1284|1340|84|678|681|685|967|27|260|263)[-](9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{4,20}$/),
        business_name: joi.when('type', { is: 'local', then: joi.string().optional().trim() }),
        service_name: joi.when([
            { is: 'local professional', then: joi.string().optional().trim() },
            { is: 'mobility', then: joi.string().optional().trim() }
        ]),
        description: joi.string().trim().optional(),
        address: joi.when('type', [
            { is: 'local', then: joi.string().trim().optional() },
            { is: 'local professional', then: joi.string().trim().optional() }
        ]),
        gift_percentage: joi.number().optional(),
        website_url: joi.string().optional(),
        facebook_url: joi.string().optional(),
        instagram_url: joi.string().optional(),
        tiktok_url: joi.string().optional(),
        opening_time: joi.when('type', { is: 'local', then: joi.string().optional().regex(/^([1-9]|0[1-9]|1[0-2]):[0-5][0-9] ([AaPp][Mm])$/) }),
        closing_time: joi.when('type', { is: 'local', then: joi.string().optional().regex(/^([1-9]|0[1-9]|1[0-2]):[0-5][0-9] ([AaPp][Mm])$/) }),
        fee_per_hour: joi.when('type', { is: 'local professional', then: joi.number().optional() }),
        fee_per_kilometer: joi.when('type', { is: 'mobility', then: joi.number().optional() }),
        driver_name: joi.when('type', { is: 'mobility', then: joi.string().trim().optional() }),
        registration_number_car: joi.when('type', { is: 'mobility', then: joi.string().trim().optional() }),
        product_name: joi.when('type', { is: 'buy s/p', then: joi.string().trim().optional() }),
        product_price: joi.when('type', { is: 'buy s/p', then: joi.string().trim().optional() }),
        business_images: joi.array().min(1).max(5).optional().items(joi.string().required()),
        business_logo: joi.string().optional(),
        lat: joi.string().regex(/^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/).optional(),
        lng: joi.string().regex(/^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/).optional(),
    })
}

export const list_businesses = {
    body: joi.object().keys({
        type: joi.string().optional(),
        category: joi.string().optional(),
        country: joi.string().required()
    })
}

export const business_id = {
    body: joi.object().keys({
        business_id: joi.string().required()
    })
}

export const post_review = {
    body: joi.object().keys({
        business_id: joi.string().required(),
        comment: joi.string().max(300).required(),
        stars: joi.number().max(5).min(0).required()
    })
}

export const delete_business = {
    query: joi.object().keys({
        business_id: joi.string().required()
    })
}

export const search_by_business_id = {
    body: joi.object().keys({
        business_id: joi.string().required(),
        country: joi.string().required(),
        amount: joi.number().required()
    })
}

export const make_payment = {
    body: joi.object().keys({
        business_id: joi.string().required(),
        image: joi.string().required(),
        id_hash: joi.string().required(),
        amount: joi.number().required()
    })
}

export const search_businesses = {
    body: joi.object().keys({
        string: joi.string().required()
    })
}

export const payment_id = {
    body: joi.object().keys({
        payment_id: joi.string().required()
    })
}