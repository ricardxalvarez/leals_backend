import { StatusCodes } from 'http-status-codes';
import passport from 'passport';
import ApiError from '../utils/ApiError.js';

const verifyCallback = (req, resolve, reject) => {
  async (err, user) => {
    if (err || !user) {
      return reject(
        new ApiError(StatusCodes.UNAUTHORIZED, "Please authenticate")
      );
    }
    req.user = { id: user.id, email: user.email, telefono: user.telefono };
    resolve()
  };
}

const auth = async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "passportPswd1",
      { session: false },
      verifyCallback(req, resolve, reject)
    )(req, res, next)
  })
    .then(() => next())
    .catch(error => next(error))
}

export default auth;