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
        if (err) throw err;
        else {
            image.resize(200, 200, jimp.RESIZE_NEAREST_NEIGHBOR)
                .quality(100)
                .getBase64(jimp.MIME_JPEG, function (err, src) {
                    if (err) res.send({ status: false, content: 'error uploading image' })
                    req.body.avatar = src
                    console.log(req.body.avatar)
                    next()
                })
        }
    })
}

export default cropAvatarImage