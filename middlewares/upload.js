const upload = (type, field) =>
    (req, res, next) => {
        // middleware to upload images to cloud
        next()
    };

export default upload;