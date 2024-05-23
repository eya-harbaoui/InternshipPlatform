const { sendapplicationConfirmationEmail } = require('../config/Nodemailer');
const Application = require('../models/application');
const Offer = require('../models/offer');

module.exports = {
  postuler: async (req, res) => {
    try {
      // Récupérer les données du formulaire de postulation
      const {
        offerId,
        establishment,
        studyLevel,
        cv,
        motivation,
        interviewDateTime,
        interviewLocation,
      } = req.body;
      // Récupérer les informations du profil de l'utilisateur connecté
      //const { firstName, lastName, email, phoneNumber } = req.user;
      const { email } = 'benmoussaamin25@gmail.com';

      // Vérifier si l'offre de stage existe
      const offer = await Offer.findById(offerId);
      if (!offer) {
        return res
          .status(404)
          .json({ message: "L'offre de stage n'existe pas." });
      }
      // Créer une nouvelle candidature
      const application = new Application({
        offer: offerId,
        applicant: '65d8e3b7be45a5561a9640fb',
        establishment,
        studyLevel,
        cv,
        motivation,
        status: 'en cours',
      });
      // Enregistrer la candidature dans la base de données
      await application.save();
      // Envoyer un e-mail de confirmation à l'utilisateur
      sendapplicationConfirmationEmail(
        email,
        interviewDateTime,
        interviewLocation
      );
      res.status(200).json({ message: 'Candidature enregistrée avec succès.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  // Route pour récupérer l'historique des candidatures de l'étudiant
  getcandidatures: async (req, res) => {
    try {
      const userId = '65d8e3b7be45a5561a9640fb'; // ID de l'utilisateur connecté

      // Récupérer les candidatures de l'étudiant à partir de son ID
      const applications = await Application.find({
        applicant: userId,
      }).populate('offer');

      // Filtrer les candidatures en fonction des statuts spécifiés
      const filteredApplications = applications.filter((application) =>
        [
          'en cours',
          'entretien technique programmé',
          'entretien RH programmé',
          'refusé',
          'accepté',
        ].includes(application.status)
      );

      // Mapper les candidatures pour ne récupérer que les détails pertinents
      const candidatureHistory = filteredApplications.map((application) => ({
        offerTitle: application.offer.title,
        applicationDate: application.createdAt,
        status: application.status,
      }));

      res.status(200).json(candidatureHistory);
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
        interviewDateTime,
        interviewLocation,
        interviewType,
      } = req.body;

      // Vérification si la candidature existe
      const application = await Application.findById(applicationId);
      if (!application) {
        return res.status(404).json({ message: 'Candidature introuvable' });
      }

      // Mise à jour des détails de l'entretien dans la candidature
      application.interviewDateTime = interviewDateTime;
      application.interviewLocation = interviewLocation;

      // Définition du statut de la candidature en fonction du type d'entretien
      application.status =
        interviewType === 'technique'
          ? 'entretien technique confirmé'
          : 'entretien RH confirmé';

      // Enregistrement des modifications dans la base de données
      await application.save();
      // Envoyer l'email
      sendapplicationConfirmationEmail(
        email = 'benmoussaamin25@gmail.com',
        interviewDateTime,
        interviewLocation
      );
      // Réponse avec la candidature mise à jour
      res.status(200).json(application);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
