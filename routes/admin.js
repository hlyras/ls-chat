const express = require('express');
const router = express.Router();
const adminController = require('../app/controller/admin');

router.get('/', adminController.index);
router.post('/updateUserAccess', adminController.updateUserAccess);
router.get('/support', adminController.support);
router.post('/supportChat', adminController.supportChat);

module.exports = router;