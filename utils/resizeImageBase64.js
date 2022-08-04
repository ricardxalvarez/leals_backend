import jimp from 'jimp'

async function resizeImageBase64(width, height, quality, data) {
    if (!data) return null
    const base = 'base64'
    const base64str = data.slice(data.indexOf(base) + base.length + 1)
    const buf = Buffer.from(base64str, base);
    let response
    await jimp.read(buf, (err, image) => {
        if (!image) { response = null; return; }
        if (err) { response = null; return; }
        else {
            image.resize(width, height)
                .quality(quality)
                .getBase64(jimp.MIME_JPEG, function (err, src) {
                    console.log(src)
                    if (err) { response = null; return; }
                    response = src;
                })
        }
    })
    return response;
}

export default resizeImageBase64;