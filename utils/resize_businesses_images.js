import jimp from 'jimp'

export default async function resize_business_image(image) {
    try {
        let result
        const base = 'base64'
        const base64str = image.slice(image.indexOf(base) + base.length + 1)
        const buf = Buffer.from(base64str, base);
        jimp.read(buf, (err, image) => {
            if (err || image.bitmap.width === 0 || image.bitmap.height === 0) {
                result = false
            }
            else {
                image.resize(jimp.AUTO, 200)
                    .quality(80)
                    .getBase64(jimp.MIME_JPEG, function (err, src) {
                        if (err) result = false
                        result = src
                    })
            }
        })
        return result
    } catch (error) {
        return error
    }
}