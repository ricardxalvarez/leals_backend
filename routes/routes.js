import express from 'express'
import { packagesController, referralsController, usersController, ticketsBuyController } from '../controllers/index.js';
import authPswd1 from '../middlewares/auth.pswd1.js'
import authPswd2 from '../middlewares/auth.pswd2.js';
import authAdmin from '../middlewares/auth.admin.js';
import countries from '../middlewares/countries.js';
import validate from '../middlewares/validate.js';
import { packagesValidation, referralsValidation, userValidation, ticketsBuyValidation } from '../validations/index.js'
import { countriesController } from '../controllers/index.js';
import validateAvatarURL from '../middlewares/validateAvatarURL.js';
import cropAvatarImage from '../middlewares/cropAvatarImage.js';

const router = express.Router();
/* User Routes. */
router.post('/register', validate(userValidation.register), countries, usersController.postSignup);
router.put('/registercompleted', express.urlencoded({ extended: true, limit: '5mb' }), validate(userValidation.registerCompleted), validateAvatarURL, cropAvatarImage, usersController.completeRegister);
router.post('/login', validate(userValidation.login), usersController.postSignin);
router.post('/login/password2', validate(userValidation.loginPassword2), usersController.postSigninPsswd2)
router.get('/users/list', authPswd1, usersController.list);
router.get('/users/search', authPswd1, usersController.search);
router.put('/users/updatepass1', validate(userValidation.updatePass1), authPswd1, usersController.updatePassword1);
router.put('/users/updatepass2', validate(userValidation.updatePass2), authPswd1, usersController.updatePassword2);
router.put('/users/avatar', express.urlencoded({ extended: true, limit: '5mb' }), validate(userValidation.updateAvatar), validateAvatarURL, authPswd1, cropAvatarImage, usersController.updateAvatar)
router.put('/users/update', validate(userValidation.updateUser), countries, authPswd1, usersController.updateUser);
router.post('/recoverypassword', validate(userValidation.recoverPassword), usersController.recoveryPassword);
router.post('/email/sendVerification', authPswd1, usersController.sendVerificationEmail)
router.post('/email/verify', validate(userValidation.emailVerify), authPswd1, usersController.verifyEmail)
router.put('/users/paymentmethod', validate(userValidation.paymentMethods), authPswd1, usersController.addPaymentMethods)
router.post('/phone/sendVerification', authPswd1, usersController.sendVerificationMessage)
router.post('/phone/verify', validate(userValidation.emailVerify), authPswd1, usersController.verifyPhone)
// Countries

router.get('/countries', countriesController.retrieveCountry)
router.get('/countries/:currency', countriesController.currencyControl)
router.get('/country/dial', countriesController.getCurrencyWithDial)

// Referrals
router.get('/referrals/children', validate(referralsValidation.getReferralChildren), authPswd1, referralsController.getReferralChildren)
router.post('/referrals/search', validate(referralsValidation.searchReferral), authPswd1, referralsController.searchReferral)


// /* Packages Routes */
router.post('/packages/create', validate(packagesValidation.create), authAdmin, packagesController.create);
router.get('/packages/list', packagesController.list);
router.post('/packages/search', validate(packagesValidation.search), packagesController.search);
router.put('/packages/update', validate(packagesValidation.update), authAdmin, packagesController.update);
router.delete('/packages/delete', validate(packagesValidation.delete_package), authAdmin, packagesController.delete_package);

//                     /* Tickets Buy Routes */
router.post('/ticketsbuy/create', validate(ticketsBuyValidation.create), authPswd1, ticketsBuyController.create);
router.get('/ticketsbuy/list', ticketsBuyController.list);
// router.get('/ticketsbuy/match', controllers.ticketsbuyController.match);
router.post('/ticketsbuy/search', validate(ticketsBuyValidation.search), ticketsBuyController.search);
// router.put('/ticketsbuy/updatstatus', controllers.ticketsbuyController.updateStatusTicket);


//                     /* Tickets Sell Routes */
// router.post('/ticketssell/create', controllers.ticketssellController.create);
// router.get('/ticketssell/list', controllers.ticketssellController.list);
// router.post('/ticketssell/search', controllers.ticketssellController.search);
// router.put('/ticketssell/updatstatus', controllers.ticketssellController.updateStatusTicket);

// tickets routes
// router.get('/tickets/list')

// /* orders */
// router.post('/order/create', auth, controllers.transactionsp2pController.create);
// router.post('/order/listbuy', auth, controllers.transactionsp2pController.listBuy);
// router.post('/order/listsell', auth, controllers.transactionsp2pController.listSell);
// router.post('/order/pay')
// router.post('/order/listopen', auth, controllers.transactionsp2pController.listOpen);
// router.post('/order/search', auth, controllers.transactionsp2pController.search);
// router.put('/order/updatstatus', auth, controllers.transactionsp2pController.updateStatusTicket);


// history
// router.get('/history/list/p2p')

//split
//router.get('/split/info')

// /* ruta salir */
// router.get('/logout', AuthMiddleware.verifyToken,controllers.loginController.getLogout);

export default router