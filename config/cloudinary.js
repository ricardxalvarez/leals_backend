import cloud from 'cloudinary'
import config from './config.js'

const cloudinary = cloud.v2

cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret
})

export default cloudinary