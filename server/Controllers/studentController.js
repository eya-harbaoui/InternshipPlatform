const Student = require('../models/user');
const { sendCodeConfirmationEmail } = require('../config/Nodemailer');
const bcrypt = require('bcrypt');
module.exports = {
  getProfile: async (req, res) => {
    try {
      const student = await Student.findById(req.params.id); 
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      if (student.role != 'Student') {
        return res
          .status(404)
          .json({ message: 'Its not a student , its a ' + student.role });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateProfile: async (req, res) => {
    try {
      const {
        establishment,
        address,
        studyLevel,
        recommendationLetter,
        phoneNumber,
      } = req.body;

      const updateData = {
        establishment,
        address,
        studyLevel,
        recommendationLetter,
        phoneNumber,
      };

      // Only set the CV if a file is uploaded
      if (req.file && req.file.filename) {
        updateData.cv = req.file.filename;
      }

      const updatedStudent = await Student.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!updatedStudent) {
        return res.status(404).json({ message: 'Student not found' });
      }

      res.json(updatedStudent);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  deleteProfile: async (req, res) => {
    try {
      const deletedStudent = await Student.findByIdAndDelete(req.params.id);
      if (!deletedStudent) {
        return res.status(404).json({ message: 'Student not found' });
      }
      res.json({ message: 'Student deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  confirm_email: async (req, res) => {
    const { email, confirmationCode } = req.body;
    try {
      const student = await Student.findOne({
        email,
        emailConfirmationCode: confirmationCode,
      });
      if (!student) {
        return res.status(400).json({ message: 'Invalid confirmation code' });
      }
      // Mettre à jour le statut de confirmation de l'e-mail
      student.emailConfirmed = true;
      await student.save();
      res.json({ message: 'Email confirmed successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  register: async (req, res) => {
    const {
      firstName,
      lastName,
      password,
      establishment,
      address,
      studyLevel,
      recommendationLetter,
      phoneNumber,
      role,
      email,
    } = req.body;

    try {
      // Generate a confirmation code
      const confirmationCode = generateConfirmationCode();

      // Send the confirmation code via email
      sendCodeConfirmationEmail(email, confirmationCode);

      // Hachage du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save the student in the database with the confirmation code and CV filename
      const newStudent = new Student({
        firstName,
        lastName,
        password: hashedPassword,
        establishment,
        address,
        studyLevel,
        cv: req.file.filename, // Save the filename from the uploaded file
        recommendationLetter,
        phoneNumber,
        email,
        role,
        emailConfirmationCode: confirmationCode,
      });

      await newStudent.save();
      res.status(201).json(newStudent);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

function generateConfirmationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
