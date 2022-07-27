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
        req.user = { id: user.id };
        resolve()
    };
}

const auth = async (req, res, next) => {
    console.log(req.session);
    if (req.session.tokenPsswd2) {
        return new Promise((resolve, reject) => {
            passport.authenticate(
                "passportPswd2",
                { session: false },
                verifyCallback(req, resolve, reject)
            )(req, res, next)
            passport.serializeUser(function (user, done) {
                done(null, user.id);
            });
        })
            .then(() => next())
            .catch(error => next(error))
    } else res.status(400).send({
        status: 'unauthorized',
        content: "enter your password"
    })
}

export default auth;