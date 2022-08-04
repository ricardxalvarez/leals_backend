import Canvas from 'canvas'
const Image = Canvas.Image

function validateAvatarURL(req, res, next) {
    const data = req.body.avatar
    // if (!data) {
    //     return next()
    // }

    // let image = new Image()
    // image.src = data
    // image.onload = function () {
    //     //This should load the image so that you can actually check
    //     //height and width.
    //     if (image.height === 0 || image.width === 0) {
    //         console.log('encoded image missing width or height');
    //         return res.send({ status: false, content: "encoded image missing width or height" });
    //     }
    // }
    return next();
}

export default validateAvatarURL