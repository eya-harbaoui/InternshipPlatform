const express = require('express');
const router = express.Router();
const studentController = require('../Controllers/studentController');
const upload = require('../config/multerConfig');
router.get('/profile/:id', studentController.getProfile);
router.put(
  '/profile/:id',
  upload.single('cv'),
  studentController.updateProfile
);
router.delete('/profile/:id', studentController.deleteProfile);
router.post('/confirm_email', studentController.confirm_email);
router.post('/register', upload.single('cv'), studentController.register);
module.exports = router;
