import jimp from 'jimp'

async function resizeImageBase64(width, height, quality, image) {
    if (!image) return null
    const base = 'base64'
    const base64str = image.slice(image.indexOf(base) + base.length + 1)
    const buf = Buffer.from(base64str, base);
    await jimp.read(buf, async (err, image) => {
        console.log(err)
        if (err) return null;
        else {
            image.resize(width, height)
                .quality(quality)
                .getBase64(jimp.MIME_JPEG, function (err, src) {
                    console.log(src)
                    if (err) return null
                    return src
                })
        }
    })
}

export default resizeImageBase64