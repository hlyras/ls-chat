const express = require('express');
const router = express.Router();
const homeController = require('../app/controller/home');

/* GET home page. */
router.get('/', homeController.index);
router.get('/login', homeController.login);
router.get('/signup', homeController.signup);
router.get('/logout', homeController.logout);

router.get('/support', homeController.support);

router.use('/user', require('./user'));
router.use('/admin', require('./admin'));
router.use('/factory', require('./factory'));

module.exports = router;