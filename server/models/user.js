const mongoose = require('mongoose');
const { roles } = require('../lib/roles');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: roles,
    required: true,
  },
  establishment: {
    type: String,
    required: this.role === 'Student',
  },
  address: {
    type: String,
    required: this.role === 'Student',
  },
  studyLevel: {
    type: String,
    required: this.role === 'Student',
  },
  cv: {
    content: Buffer, // Champ pour stocker les données binaires du fichier PDF
    contentType: String, // Champ pour spécifier le type de contenu du fichier (application/pdf)
    name: String,
    required: this.role === 'Student',
  },
  recommendationLetter: {
    type: String,
    required: this.role === 'Student',
  },
  emailConfirmationCode: {
    type: String,
  },
  emailConfirmed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('User', userSchema);
