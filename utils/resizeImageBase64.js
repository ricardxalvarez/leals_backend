import jimp from 'jimp'

async function resizeImageBase64(width, height, quality, image) {
    if (!image) return null
    const base = 'base64'
    const base64str = image.slice(image.indexOf(base) + base.length + 1)
    const buf = Buffer.from(base64str, base);
    let response
    await jimp.read(buf, (err, image) => {
        if (err) response = null;
        else {
            image.resize(width, height)
                .quality(quality)
                .getBase64(jimp.MIME_JPEG, function (err, src) {
                    console.log(src)
                    if (err) response = null
                    response = src
                })
        }
    })
    return response
}

export default resizeImageBase64