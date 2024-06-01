const { sendapplicationConfirmationEmail } = require('../config/Nodemailer');
const { sendinterviewConfirmationEmail } = require('../config/Nodemailer');

const Application = require('../models/application');
const Offer = require('../models/offer');
const User = require('../models/user');
module.exports = {
  postuler: async (req, res) => {
    try {
      // Récupérer les données du formulaire de postulation
      const { offer, applicant } = req.body;
      const applicantId = await User.findById(applicant);
      // Vérifier si l'offre de stage existe
      const offerId = await Offer.findById(offer);
      if (!offerId) {
        return res
          .status(404)
          .json({ message: "L'offre de stage n'existe pas." });
      }
      // Créer une nouvelle candidature
      const application = new Application({
        offer: offer,
        applicant: applicant,
        status: 'en cours',
      });
      // Enregistrer la candidature dans la base de données
      await application.save();
      // Envoyer un e-mail de confirmation à l'utilisateur

      sendapplicationConfirmationEmail(applicantId.email, offerId.title);
      res.status(200).json({ message: 'Candidature enregistrée avec succès.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  // Route pour récupérer l'historique des candidatures de l'étudiant
  getcandidatures: async (req, res) => {
    const userId = req.params.id;
    try {
      // Récupérer les candidatures de l'étudiant à partir de son ID
      const applications = await Application.find({
        applicant: userId,
      })
        .populate({
          path: 'offer',
          populate: {
            path: 'domain',
            select: 'name',
          },
        })
        .populate({
          path: 'offer',
          populate: {
            path: 'skills.skill',
            select: 'name',
          },
        });

      res.status(200).json(applications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Route pour récupérer l'historique des candidatures de l'étudiant
  getcandidaturesByInterviewer: async (req, res) => {
    const userId = req.params.id;
    try {
      // Récupérer les candidatures de l'étudiant à partir de son ID
      const applications = await Application.find({
        interviewer: userId,
      })
        .populate({
          path: 'offer',
          populate: {
            path: 'domain',
            select: 'name',
          },
        })
        .populate({
          path: 'offer',
          populate: {
            path: 'skills.skill',
            select: 'name',
          },
        })
        .populate('applicant') // Populate applicant details;
        .populate({
          path: 'applicantSkills.skill',
          select: 'name',
        });

      res.status(200).json(applications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getApplicationById: async (req, res) => {
    try {
      const applicationId = req.params.id;
      const application = await Application.findById(applicationId)
        .populate({
          path: 'offer',
          populate: {
            path: 'domain',
            select: 'name',
          },
        })
        .populate({
          path: 'offer',
          populate: {
            path: 'skills.skill',
            select: 'name',
          },
        })
        .populate('applicant') // Populate applicant details;
        .populate({
          path: 'applicantSkills.skill',
          select: 'name',
        });
      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  refuseApplication: async (req, res) => {
    try {
      const { applicationId, rejectionReason } = req.body;

      // Vérifier si l'ID de la candidature est fourni
      if (!applicationId) {
        return res
          .status(400)
          .json({ message: "L'identifiant de la candidature est requis." });
      }

      // Vérifier si le motif de refus est fourni
      if (!rejectionReason) {
        return res
          .status(400)
          .json({ message: 'Le motif de refus est requis.' });
      }

      // Rechercher la candidature par son ID
      const application = await Application.findById(applicationId);

      // Vérifier si la candidature existe
      if (!application) {
        return res.status(404).json({ message: 'Candidature introuvable.' });
      }

      // Mettre à jour le motif de refus et le statut de la candidature
      application.rejectionReason = rejectionReason;
      application.status = 'refusé';

      // Enregistrer les modifications
      await application.save();

      res.status(200).json({ message: 'Candidature refusée avec succès.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  scheduleInterview: async (req, res) => {
    try {
      // Récupération de l'ID de la candidature et des détails de l'entretien depuis le corps de la requête
      const {
        applicationId,
        email,
        status,
        interviewer,
        technicallyEvaluated,
        interviewDateTime,
        interviewMode,
        interviewLocation,
        interviewLink,
        interviewType,
      } = req.body;

      // Vérification si la candidature existe
      const application = await Application.findById(applicationId);
      console.log(req.body, 'req.body');
      console.log(application, 'application');
      if (!application) {
        return res.status(404).json({ message: 'Candidature introuvable' });
      }
      // Mise à jour des détails de l'entretien dans la candidature
      application.interviewDateTime = interviewDateTime;
      application.interviewLink = interviewLink;
      application.interviewMode = interviewMode;
      application.interviewLocation = interviewLocation;
      application.interviewer = interviewer;
      application.technicallyEvaluated = technicallyEvaluated;
      application.status = status;
      application.interviewType = interviewType;

      // Enregistrement des modifications dans la base de données
      await application.save();
      // Envoyer l'email
      sendinterviewConfirmationEmail(
        email,
        interviewDateTime,
        interviewMode,
        interviewLink,
        interviewLocation,
        interviewType
      );
      // Réponse avec la candidature mise à jour
      res.status(200).json(application);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateApplication: async (req, res) => {
    try {
      const application = await Application.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
      if (!application) {
        return res.status(404).json({ message: 'application not found' });
      }
      res.json(application);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};
