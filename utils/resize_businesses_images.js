import jimp from 'jimp'

export default async function resize_business_image(image) {
    let result
    const base = 'base64'
    const base64str = image.slice(image.indexOf(base) + base.length + 1)
    const buf = Buffer.from(base64str, base);
    await jimp.read(buf, (err, image) => {
        if (err || image.bitmap.width === 0 || image.bitmap.height === 0) {
            return result = false
        }
        else {
            image.resize(jimp.AUTO, 200)
                .quality(80)
                .getBase64(jimp.MIME_JPEG, function (err, src) {
                    if (err) return result = false
                    result = src
                })
        }
    })
    console.log(result)
    return result
}