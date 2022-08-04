import jimp from 'jimp'
import Canvas from 'canvas'
const Image = Canvas.Image

async function resizeImageBase64(width, height, quality, data) {
    if (!data) return null
    let response

    let image = new Image()
    image.src = data
    image.onload = function () {
        //This should load the image so that you can actually check
        //height and width.
        console.log(image)
        if (!image) { response = null; return null; }
        if (image.height === 0 || image.width === 0) {
            console.log('encoded image missing width or height');
            response = null
            return null;
        } else response = true
    }
    console.log(response)
    if (response) {
        return null
    }
    const base = 'base64'
    const base64str = data.slice(data.indexOf(base) + base.length + 1)
    const buf = Buffer.from(base64str, base);
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