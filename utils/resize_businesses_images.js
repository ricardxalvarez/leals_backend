import jimp from 'jimp'

export default async function resize_business_image(business_image) {
    let result
    const base = 'base64'
    const base64str = business_image.slice(business_image.indexOf(base) + base.length + 1)
    const buf = Buffer.from(base64str, base);
    console.log('reading image')
    await jimp.read(buf, async (err, image) => {
        if (err || image.bitmap.width === 0 || image.bitmap.height === 0) {
            return result = false
        }
        else {
            image
                .quality(80)
                .getBase64(jimp.MIME_JPEG, function (err, src) {
                    console.log(err)
                    console.log(src)
                    if (err) return result = false
                    return result = src
                })
        }
    })
    return result
}