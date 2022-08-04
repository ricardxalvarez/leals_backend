import jimp from 'jimp'
async function cropAvatarImage(req, res, next) {
    const image = req.body.avatar
    const base = 'base64'
    const base64str = image.slice(image.indexOf(base) + base.length + 1)
    const buf = Buffer.from(base64str, base);
    jimp.read(buf, (err, image) => {
        if (err) throw err;
        else {
            image.resize(200, 200)
                .quality(100)
                .getBase64(jimp.MIME_JPEG, function (err, src) {
                    console.log("rb is \n")
                    console.log(src);
                })
        }
    })
}

export default cropAvatarImage