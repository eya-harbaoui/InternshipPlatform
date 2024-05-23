const express = require('express');
const router = express.Router();
const UserController = require('../controllers/usersController');
const { IsAdmin } = require('../middlewares/middleware');

// Routes for CRUD operations on users
router.post('/', IsAdmin, UserController.createUser);
router.post('/login', UserController.login);
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUserById);
router.delete('/:id', UserController.deleteUserById);

module.exports = router;
