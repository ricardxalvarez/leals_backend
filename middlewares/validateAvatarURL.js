import Canvas from 'canvas'
const Image = Canvas.Image

function validateAvatarURL(req, res, next) {
    const data = req.body.avatar
    if (!data) {
        return next()
    }
    let knownTypes = {
        '/': 'data:image/jpg;base64,',
        'i': 'data:image/png;base64,',
        /*ETC*/
    }

    let image = new Image()

    if (!knownTypes[data[0]]) {
        console.log("encoded image didn't match known types");
        return res.send({ status: false, content: "encoded image didn't match known types" });
    } else {
        image.src = knownTypes[0] + data
        image.onload = function () {
            //This should load the image so that you can actually check
            //height and width.
            if (image.height === 0 || image.width === 0) {
                console.log('encoded image missing width or height');
                return res.send({ status: false, content: "encoded image missing width or height" });
            }
        }
        return next();
    }
}

export default validateAvatarURL