import Canvas from 'canvas'
const Image = Canvas.Image

export default function validate_image(data) {
    if (!data) return true
    let image = new Image()
    image.src = data
    if (image.complete) {
        if (!image) return false
        if (image.height === 0 || image.width === 0) {
            console.log('encoded image missing width or height');
            return false
        }
    } else {
        image.onload = function () {
            //This should load the image so that you can actually check
            //height and width.
            if (!image) return false
            if (image.height === 0 || image.width === 0) {
                console.log('encoded image missing width or height');
                return false
            }
        }
    }
    return true
}