const Student = require('../models/user');
const { sendCodeConfirmationEmail } = require('../config/Nodemailer');

module.exports = {
  getProfile: async (req, res) => {
    try {
      const student = await Student.findById(req.params.id); // Suppose que vous stockez l'ID de l'utilisateur connecté dans req.userId
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
      const updatedStudent = await Student.findByIdAndUpdate(
        req.params.id,
        req.body,
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
      cv,
      role,
      email,
    } = req.body;
    try {
      // Générer un code de confirmation aléatoire
      const confirmationCode = generateConfirmationCode();
      // Envoyer le code de confirmation par e-mail
      sendCodeConfirmationEmail(email, confirmationCode);
      // Enregistrer l'étudiant dans la base de données avec le code de confirmation
      console.log(cv);
      const pdf = {
        name: cv.name,
        content: cv.buffer,
        contentType: cv.type,
      };
      console.log(pdf);
      const newStudent = new Student({
        firstName,
        lastName,
        password,
        establishment,
        address,
        studyLevel,
        cv: pdf,
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
