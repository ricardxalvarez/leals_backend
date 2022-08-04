import jimp from 'jimp'

async function resizeImageBase64(width, height, quality, image) {
    if (!image) return null
    const base = 'base64'
    const base64str = image.slice(image.indexOf(base) + base.length + 1)
    const buf = Buffer.from(base64str, base);
    jimp.read(buf, (err, image) => {
        if (err) return null;
        else {
            image.resize(width, height, jimp.AUTO)
                .quality(quality)
                .getBase64(jimp.MIME_JPEG, function (err, src) {
                    if (err) return null
                    return src
                })
        }
    })
}

export default resizeImageBase64