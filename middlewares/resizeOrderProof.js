import jimp from 'jimp'

async function resizeOrderProof(req, res, next) {
    const image = req.body.proof
    const base = 'base64'
    const base64str = image.slice(image.indexOf(base) + base.length + 1)
    const buf = Buffer.from(base64str, base);
    jimp.read(buf, (err, image) => {
        if (err || image.bitmap.width === 0 || image.bitmap.height === 0) {
            res.send({ status: false, content: 'This format is not valid for proof' })
            throw err;
        }
        else {
            image.resize(jimp.AUTO, 200)
                .quality(70)
                .getBase64(jimp.MIME_JPEG, function (err, src) {
                    if (err) res.send({ status: false, content: 'error uploading image' })
                    req.body.proof = src
                    next()
                })
        }
    })
}

export default resizeOrderProof