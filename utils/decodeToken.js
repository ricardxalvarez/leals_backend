import jwt from 'jsonwebtoken'
import config from '../config/config.js'

const decodeToken = (token) => {
    const decodedToken = jwt.decode(token, config.jwt.secret)
    return decodedToken
}

export default decodeToken;