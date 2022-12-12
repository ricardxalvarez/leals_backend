import express from 'express'
import {
    packagesController,
    referralsController,
    usersController,
    ticketsBuyController,
    ticketsSellController,
    ticketsController,
    walletController,
    ordersController,
    countriesController,
    notificationsController,
    historyController,
    splitController,
    adminController,
    advertisesController,
    transfersController,
    withdrawalsController,
    penaltyFeesController,
    adsInfoController
} from '../controllers/index.js';
import {
    packagesValidation,
    referralsValidation,
    userValidation,
    ticketsValidation,
    ticketsBuyValidation,
    ticketsSellValidation,
    ordersValidation,
    notificationsValidation,
    advertisesValidation,
    adminValidation,
    transfersValidation,
    withdrawalsValidation
} from '../validations/index.js'
import authPswd1 from '../middlewares/auth.pswd1.js'
import authPswd2 from '../middlewares/auth.pswd2.js';
import authAdmin from '../middlewares/auth.admin.js';
import countries from '../middlewares/countries.js';
import validate from '../middlewares/validate.js';
import validateAvatarURL from '../middlewares/validateAvatarURL.js';
import cropAvatarImage from '../middlewares/cropAvatarImage.js';
import resizeOrderProof from '../middlewares/resizeOrderProof.js';

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
router.put('/users/paymentmethod', validate(userValidation.paymentMethods), authPswd1, usersController.addPaymentMethods)
// verify messages and verification codes
router.post('/phone/sendVerification', authPswd1, usersController.sendVerificationMessage)
router.post('/phone/verify', validate(userValidation.emailVerify), authPswd1, usersController.verifyPhone)
// sending emails
router.post('/email/verify', validate(userValidation.emailVerify), authPswd1, usersController.verifyEmail)
router.post('/email/sendVerification', authPswd1, usersController.sendVerificationEmail)
router.post('/recoverypassword', validate(userValidation.recoverPassword), usersController.recoveryPassword);
router.post('/recoverypassword2', validate(userValidation.recoverPassword2), usersController.recoveryPassword2)
// Countries

router.get('/countries', countriesController.retrieveCountry)
router.get('/countries/:currency', countriesController.currencyControl)
router.get('/country/dial', countriesController.getCurrencyWithDial)

// Referrals
router.get('/referrals/children', validate(referralsValidation.getReferralChildren), authPswd1, referralsController.getReferralChildren)
router.post('/referrals/search', validate(referralsValidation.searchReferral), authPswd1, referralsController.searchReferral)


// /* Packages Routes */
router.post('/admin/packages/create', validate(packagesValidation.create), authAdmin, packagesController.create);
router.get('/packages/list', packagesController.list);
router.get('/admin/packages/list', authAdmin, packagesController.admin_list)
router.get('/packages/search', validate(packagesValidation.search), packagesController.search);
router.put('/admin/packages/update', validate(packagesValidation.update), authAdmin, packagesController.update);
router.delete('/admin/packages/delete', validate(packagesValidation.delete_package), authAdmin, packagesController.delete_package);

//                     /* Tickets Buy Routes */
router.post('/ticketsbuy/create', validate(ticketsBuyValidation.create), authPswd1, ticketsBuyController.create);
router.get('/ticketsbuy/list', ticketsBuyController.list);
router.post('/ticketsbuy/search', validate(ticketsBuyValidation.search), ticketsBuyController.search);


//                     /* Tickets Sell Routes */
router.post('/ticketssell/create', validate(ticketsSellValidation.create), authPswd2, ticketsSellController.create);
router.get('/ticketssell/list', ticketsSellController.list);
router.post('/ticketssell/search', validate(ticketsSellValidation.search), authPswd1, ticketsSellController.search);
router.get('/ticketssell/get_fee', ticketsSellController.getFee)

// tickets routes
router.get('/tickets/list', authPswd1, ticketsController.list)
router.post('/tickets/cancel', validate(ticketsValidation.cancel), authPswd1, ticketsController.cancel)

// wallet routes
router.get('/wallet/info', authPswd1, walletController.get_info)

// /* orders */
router.get('/orders/listbuy', authPswd1, ordersController.list_buy);
router.get('/orders/listsell', authPswd1, ordersController.list_sell);
router.get('/orders/list', validate(ordersValidation.list), authPswd1, ordersController.list)
router.post('/orders/search', validate(ordersValidation.search), authPswd1, ordersController.search);
router.post('/orders/sendproof', validate(ordersValidation.send_proof), authPswd1, resizeOrderProof, ordersController.send_proof)
router.post('/orders/approve', validate(ordersValidation.approve), authPswd1, ordersController.approve_order)

// notifications
router.get('/notifications/list', authPswd1, notificationsController.list)
router.post('/notifications/read', validate(notificationsValidation.read), authPswd1, notificationsController.read)
router.post('/notifications/read_all', authPswd1, notificationsController.read_all)
router.delete('/notifications/delete', validate(notificationsValidation.delete_order), authPswd1, notificationsController.delete_order)
router.delete('/notifications/delete_all', authPswd1, notificationsController.delete_all)

// history
router.get('/history/list/p2p', authPswd1, historyController.list_history_p2p)

//split
router.get('/split/info', authPswd1, splitController.split_info)


// transfers
router.post('/transfers/create', validate(transfersValidation.create), authPswd2, transfersController.create_transfer)

// withdrawals
router.post('/withdrawals/request', validate(withdrawalsValidation.request_withdrawal), authPswd2, withdrawalsController.request_wihtdrawal)

// penalty fees
router.get('/penalty_fees/info', penaltyFeesController.get_info)

// admin
router.post('/admin/login', validate(userValidation.login), usersController.postSigninAdmin)
router.post('/admin/wallet/add_balance', validate(adminValidation.add_balance), authAdmin, adminController.add_balance)
router.post('/admin/wallet/decrease_balance', validate(adminValidation.add_balance), authAdmin, adminController.decrease_balance)
router.post('/admin/clean', authAdmin, adminController.clean)
router.post('/admin/withdrawals/list', validate(adminValidation.list_withdrawals), authAdmin, adminController.list_withdrawals)
router.post('/admin/handle_switches', validate(adminValidation.handle_switches), authAdmin, adminController.handle_switches)
router.post('/admin/update/commissions/rules', validate(adminValidation.commissions_rules), authAdmin, adminController.update_commissions_rules)
router.post('/admin/update/rules/ads', validate(adminValidation.ads_rules), authAdmin, adminController.rules_ads)
router.post('/admin/withdrawals/by_requester', validate(adminValidation.withdrawals_by_requester), authAdmin, adminController.get_withdrawals_by_requester)
router.post('/admin/withdrawal/info', validate(adminValidation.get_withdrawal), authAdmin, adminController.get_withdrawal_info)
router.post('/admin/advertises/list', validate(adminValidation.list_advertises), authAdmin, adminController.list_advertises)
router.post('/admin/advertise/info', validate(adminValidation.advertise_info), authAdmin, adminController.get_advertise_info)
router.post('/admin/advertises/by_requester', validate(adminValidation.advertises_by_username), authAdmin, adminController.get_advertises_by_username)
router.put('/admin/update/ads_config', validate(adminValidation.update_ads_config), authAdmin, adminController.update_ads_config)
router.get('/admin/get_team', validate(adminValidation.get_team), authAdmin, adminController.get_team)
router.post('/admin/get_team/by_username', validate(adminValidation.get_team_by_username), authAdmin, adminController.get_tree_by_username)
router.post('/admin/users/list', validate(adminValidation.list_users), authAdmin, adminController.list_users)
router.post('/admin/users/search_by_username', validate(adminValidation.search_by_username), authAdmin, adminController.search_by_username)
router.put('/admin/user/update_info', validate(adminValidation.user_update_info), authAdmin, adminController.update_user_info)
router.post('/admin/get_user/info', validate(adminValidation.user_info), authAdmin, adminController.get_user_info)
router.post('/admin/block/user', validate(adminValidation.block_unblock_buttons), authAdmin, adminController.block_user_buttons)
router.post('/admin/unblock/user', validate(adminValidation.block_unblock_buttons), authAdmin, adminController.unblock_user_buttons)
router.post('/admin/make_admin', validate(adminValidation.make_admin), authAdmin, adminController.make_admin)
router.put('/admin/update/leal_value', validate(adminValidation.update_leal_value), authAdmin, adminController.update_leal_value)
router.put('/admin/update/split', validate(adminValidation.update_split), authAdmin, adminController.update_initial_split)
router.put('/admin/update/earnings_stop', validate(adminValidation.update_earnings_stop), authAdmin, adminController.update_earnings_stop)
router.put('/admin/update/sending_time_hash', validate(adminValidation.update_sending_time_hash), authAdmin, adminController.update_sending_time_hash)
router.put('/admin/update/sell_withdrawal_minimun_amount', validate(adminValidation.update_wthdrawal_sell_minimun_amount), authAdmin, adminController.update_wthdrawal_sell_minimun_amount)

router.post('/admin/business/list', validate(adminValidation.list_businesses), authAdmin, adminController.list_businesses)
router.post('/admin/business/get_info', validate(adminValidation.get_business_info), authAdmin, adminController.get_business_info)
router.put('/admin/business/approve', validate(adminValidation.approve_business), authAdmin, adminController.approve_business)
router.put('/admin/business/deny', validate(adminValidation.deny_business), authAdmin, adminController.deny_business)
router.post('/admin/business/search_by_user', validate(adminValidation.search_business_by_username), authAdmin, adminController.search_business_by_username)
router.put('/admin/business/update/businesses_config', validate(adminValidation.update_businesses_config), authAdmin, adminController.update_businesses_config)
router.get('/admin/business/get_businesses_config', authAdmin, adminController.get_businesses_config)

router.post('/admin/advertises/approve', validate(adminValidation.approve_advertise), authAdmin, adminController.approve_advertise)
router.post('/admin/advertises/deny', validate(adminValidation.approve_advertise), authAdmin, adminController.deny_advertise)
router.post('/admin/withdrawals/approve', validate(adminValidation.approve_withdrawal), authAdmin, adminController.approve_withdrawal)
router.post('/admin/withdrawals/deny', validate(adminValidation.approve_withdrawal), authAdmin, adminController.deny_withdrawal)
router.get('/admin/get_home_page', authAdmin, adminController.get_home_page)
router.get('/admin/get_p2p_settings', authAdmin, adminController.get_p2p_settings_page)
router.get('/admin/get_split_settings', authAdmin, adminController.get_split_settings_page)
router.get('/admin/get_ads_settings', authAdmin, adminController.get_ads_config)

router.post('/advertises/post', validate(advertisesValidation.post_advertise), authPswd1, advertisesController.post_advertise)
router.get('/advertises/list', authPswd1, advertisesController.list_advertises)

// ads info
router.get('/ads/info', adsInfoController.get_ads_info)

// /* ruta salir */
// router.get('/logout', AuthMiddleware.verifyToken,controllers.loginController.getLogout);

export default router