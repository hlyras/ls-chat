const express = require('express');
const router = express.Router();
const adminController = require('../app/controller/admin');

router.get('/', adminController.index);
router.post('/updateUserAccess', adminController.updateUserAccess);
router.post('/support', adminController.support);

module.exports = router;