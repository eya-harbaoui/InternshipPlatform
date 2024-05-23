const express = require('express');
const router = express.Router();
const studentController = require('../Controllers/studentController');

router.get('/profile/:id', studentController.getProfile);
router.put('/profile/:id', studentController.updateProfile);
router.delete('/profile/:id', studentController.deleteProfile);
router.post('/confirm_email', studentController.confirm_email);
router.post('/register', studentController.register);

module.exports = router;
