import jimp from 'jimp'
async function crop_image(image) {
    let result
    if (!image) {
        return false
    }
    const base = 'base64'
    const base64str = image.slice(image.indexOf(base) + base.length + 1)
    const buf = Buffer.from(base64str, base);
    jimp.read(buf, (err, image) => {
        let scroll_x = 0
        let scroll_y = 0
        if (err) throw err;
        else {
            const width = image.bitmap.width < image.bitmap.height ? 80 : jimp.AUTO
            const height = image.bitmap.width < image.bitmap.height ? jimp.AUTO : 80
            image.resize(width, height, (err, src) => {
                scroll_x = image.bitmap.width < image.bitmap.height ? 0 : (src.bitmap.width / 2) - (80 / 2)
                scroll_y = image.bitmap.width < image.bitmap.height ? (src.bitmap.height / 2) - (80 / 2) : 0
            })
                .crop(scroll_x > 0 ? scroll_x : 0, scroll_y > 0 ? scroll_y : 0, 80, 80)
                .quality(70)
                .getBase64(jimp.MIME_JPEG, function (err, src) {
                    if (err) return result = false
                    return result = src
                })
        }
    })
    return result
}

export default crop_image