import jimp from 'jimp'
async function cropAvatarImage(req, res, next) {
    const image = req.body.avatar
    if (!image) {
        return next()
    }
    const base = 'base64'
    const base64str = image.slice(image.indexOf(base) + base.length + 1)
    const buf = Buffer.from(base64str, base);
    jimp.read(buf, (err, image) => {
        let scroll_x = 0
        let scroll_y = 0
        if (err) throw err;
        else {
            const width = image.bitmap.width <= image.bitmap.height ? 150 : jimp.AUTO
            const height = image.bitmap.width <= image.bitmap.height ? jimp.AUTO : 150
            image.resize(width, height, (err, src) => {
                scroll_x = (src.bitmap.width / 2) - (150 / 2)
                scroll_y = (src.bitmap.height / 2) - (150 / 2)
            })
                .crop(scroll_x >= 0 ? scroll_x : 0, scroll_y >= 0 ? scroll_y : 0, 150, 150)
                .quality(70)
                .getBase64(jimp.MIME_JPEG, function (err, src) {
                    if (err) res.send({ status: false, content: 'error uploading image' })
                    req.body.avatar = src
                    next()
                })
        }
    })
}

export default cropAvatarImage