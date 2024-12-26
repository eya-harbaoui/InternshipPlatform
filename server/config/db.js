const mongoose = require('mongoose');

async function connectDB() {
  try {
    mongoose.set('strictQuery', false); // Supprimer l'avertissement de dépréciation

    await mongoose.connect('mongodb://mongo:27017/pfe-rh', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    process.exit(1); // Exit process with failure
  }
}
// config.js
module.exports = {
  JWT_SECRET_KEY: 'your_secret_key_here',
};

module.exports = connectDB;
