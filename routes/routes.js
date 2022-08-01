import express from 'express'
import { referralsController, usersController } from '../controllers/index.js';
import authPswd1 from '../middlewares/auth.pswd1.js'
import authPswd2 from '../middlewares/auth.pswd2.js';
import countries from '../middlewares/countries.js';
import validate from '../middlewares/validate.js';
import { referralsValidation, userValidation } from '../validations/index.js'
import { countriesController } from '../controllers/index.js';

const router = express.Router();
/* Rutas de Users. */
router.post('/register', validate(userValidation.register), countries, usersController.postSignup);
router.put('/registercompleted', validate(userValidation.registerCompleted), usersController.completeRegister);
router.post('/login', validate(userValidation.login), usersController.postSignin);
router.post('/login/password2', validate(userValidation.loginPassword2), usersController.postSigninPsswd2)
router.get('/users/list', authPswd1, usersController.list);
router.post('/users/search', validate(userValidation.searchUser), authPswd1, usersController.search);
// id user is not necessary, since we are already using bearer token
router.put('/users/updatepass1', validate(userValidation.updatePass1), authPswd1, usersController.updatePassword1);
router.put('/users/updatepass2', validate(userValidation.updatePass2), authPswd1, usersController.updatePassword2);
// id user is not necessary, since we are already using bearer token
router.put('/users/update', validate(userValidation.updateUser), authPswd1, usersController.updateUser);
router.put('/recoverypassword', validate(userValidation.recoverPassword), usersController.recoveryPassword);
// new
router.post('/email/sendVerification', authPswd1, usersController.sendVerificationEmail)
router.post('/email/verify', validate(userValidation.emailVerify), authPswd1, usersController.verifyEmail)
router.put('/users/paymentmethod', validate(userValidation.paymentMethods), authPswd1, usersController.addPaymentMethods)
// Countries

router.get('/countries', countriesController.retrieveCountry)
router.get('/countries/:currency', countriesController.currencyControl)
router.get('/contry/dial', countriesController.getCurrencyWithDial)

// Referrals
router.get('/referrals/children', validate(referralsValidation.getReferralChildren), authPswd1, referralsController.getReferralChildren)
router.post('/referrals/search', validate(referralsValidation.searchReferral), authPswd1, referralsController.searchReferral)

// /* transactions P2P */
// router.post('/transaction/create', auth, controllers.transactionsp2pController.create);
// router.post('/transaction/listbuy', auth, controllers.transactionsp2pController.listBuy);
// router.post('/transaction/listsell', auth, controllers.transactionsp2pController.listSell);
// router.post('/transaction/listopen', auth, controllers.transactionsp2pController.listOpen);
// router.post('/transaction/search', auth, controllers.transactionsp2pController.search);
// router.put('/transaction/updatstatus', auth, controllers.transactionsp2pController.updateStatusTicket);
// router.get('/transaction/match', auth, controllers.transactionsp2pController.match);



// /* Packages Routes */
// router.post('/packages/create', auth, controllers.packagesController.create);
// router.get('/packages/list', auth, controllers.packagesController.list);
// router.post('/package/search', auth, controllers.packagesController.search);
// router.put('/packages/update', auth, controllers.packagesController.update);
// router.delete('/packages/delete', AuthMiddleware.verifyToken, controllers.packagesController.delete);


//                     /* Tickets Buy Routes */
// router.post('/ticketsbuy/create', controllers.ticketsbuyController.create);
// router.get('/ticketsbuy/list', controllers.ticketsbuyController.list);
// router.get('/ticketsbuy/match', controllers.ticketsbuyController.match);
// router.post('/ticketsbuy/search', controllers.ticketsbuyController.search);
// router.put('/ticketsbuy/updatstatus', controllers.ticketsbuyController.updateStatusTicket);


//                     /* Tickets Sell Routes */
// router.post('/ticketssell/create', controllers.ticketssellController.create);
// router.get('/ticketssell/list', controllers.ticketssellController.list);
// router.post('/ticketssell/search', controllers.ticketssellController.search);
// router.put('/ticketssell/updatstatus', controllers.ticketssellController.updateStatusTicket);


// /* ruta salir */
// router.get('/logout', AuthMiddleware.verifyToken,controllers.loginController.getLogout);

export default router