import jimp from 'jimp'
import Canvas from 'canvas'
const Image = Canvas.Image

async function resizeImageBase64(width, height, quality, data) {
    if (!data) return null
    let error

    let image = new Image()
    image.src = data
    if (image.complete) {
        if (!image) error = true
        if (image.height === 0 || image.width === 0) {
            console.log('encoded image missing width or height');
            error = true
        } else error = null
    } else {
        image.onload = () => {
            //This should load the image so that you can actually check
            //height and width.
            if (!image) error = true
            if (image.height === 0 || image.width === 0) {
                console.log('encoded image missing width or height');
                error = true
            } else error = null
        }
    }
    if (error) {
        return null;
    }
    let response
    const base = 'base64'
    const base64str = data.slice(data.indexOf(base) + base.length + 1)
    const buf = Buffer.from(base64str, base);
    await jimp.read(buf, (err, image) => {
        let scroll_x = 0
        let scroll_y = 0
        if (err) return
        else {
            image.resize(width, height, (err, src) => {
                scroll_x = (src.bitmap.width / 2) - (150 / 2)
                scroll_y = (src.bitmap.height / 2) - (150 / 2)
            })
                .crop(scroll_x >= 0 ? scroll_x : 0, scroll_y >= 0 ? scroll_y : 0, 150, 150)
                .quality(quality)
                .getBase64(jimp.MIME_JPEG, function (err, src) {
                    if (err) response = null
                    response = src
                })
        }

    })
    return response;
}

export default resizeImageBase64;