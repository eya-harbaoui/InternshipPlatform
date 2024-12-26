const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { senduser } = require('../config/Nodemailer');


module.exports = {
  // Controller function to create a new user
  createUser: async (req, res) => {
    try {
      // Récupérer les données de la requête
      const { firstName, lastName, email, password, phoneNumber, role } =
        req.body;
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
      // Hachage du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
      // Création d'un nouvel utilisateur avec le mot de passe crypté
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phoneNumber,
        role,
      });
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      // Gérer les erreurs
      res.status(400).json({ message: error.message });
    }
  },

  // Controller function to get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Controller function to get users by role
  getUsersByRole: async (req, res) => {
    try {
      const role = req.params.role;
      const users = await User.find({ role });
      if (users.length === 0) {
        return res
          .status(404)
          .json({ message: 'No users found with the specified role' });
      }
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Controller function to get a single user by ID
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Controller function to update a user by ID
  updateUserById: async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Controller function to delete a user by ID
  deleteUserById: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  login: async (req, res) => {
    try {
      // Rechercher l'utilisateur par son email (à la fois dans les étudiants et les utilisateurs)
      const user = await User.findOne({ email: req.body.email });
      // Si aucun utilisateur n'est trouvé, renvoyer une erreur
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      // Si un utilisateur est trouvé, vérifier son mot de passe et générer un token JWT
      const passwordMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!passwordMatch) {
        return res
          .status(401)
          .json({ message: 'Invalid credentials for user' });
      }
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: Date.now() + process.env.EXPIRE }
      );
      res.cookie('token', token, {
        // Set other options if needed, like expiration time, secure, etc.
        // Example:
        secure: true, // send cookie over HTTPS only
        httpOnly: true, // cookie is accessible only by the web server
      });
      return res.json({ token });
    } catch (error) {
      // En cas d'erreur, renvoyer un message d'erreur
      res.status(500).json({ message: error.message });
    }
  },
};