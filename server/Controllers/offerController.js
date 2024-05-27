const Offer = require('../models/offer');
const Application = require('../models/application');

module.exports = {
  // Contrôleur pour créer une nouvelle offre de stage
  createOffer: async (req, res) => {
    try {
      // Extract skills with levels from req.body
      const { skills, ...offerData } = req.body;
      // Validate if skills array is present and not empty
      if (!skills || !Array.isArray(skills) || skills.length === 0) {
        return res
          .status(400)
          .json({ message: 'Skills data is missing or invalid.' });
      }
      // Map skills to extract skill IDs and levels
      const skillDetails = skills.map((skill) => ({
        skill: skill.skill, // Assuming skill.skill contains the ID of the skill
        level: skill.level, // Assuming skill.level contains the level of the skill
      }));
      // Create new offer with skill details
      const newOffer = new Offer({ ...offerData, skills: skillDetails });
      // Save the offer
      await newOffer.save();
      // Respond with the newly created offer
      res.status(201).json(newOffer);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  // Fonction pour récupérer tous les offres
  getAllOffers: async (req, res) => {
    try {
      // Fetch all offers from the database
      const offers = await Offer.find().populate('domain');

      // Modify the offers array to include only the domain name and necessary fields from skills
      const modifiedOffers = offers.map((offer) => {
        const modifiedSkills = offer.skills.map((skill) => ({
          skill: skill.skill,
          level: skill.level,
        }));

        return {
          ...offer.toObject(), // Convert Mongoose document to plain JavaScript object
          domain: {
            _id: offer.domain._id,
            name: offer.domain.name,
          },
          skills: modifiedSkills,
        };
      });

      // Respond with the modified array of offers
      res.status(200).json(modifiedOffers);
    } catch (error) {
      // If an error occurs, respond with an error message
      res.status(500).json({ message: error.message });
    }
  },

  getOfferById: async (req, res) => {
    try {
      const offer = await Offer.findById(req.params.id);
      if (!offer) {
        return res.status(404).json({ message: 'Offer not found' });
      }
      res.json(offer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Contrôleur pour modifier une offre de stage existante
  updateOffer: async (req, res) => {
    try {
      const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!offer) {
        return res.status(404).json({ message: 'Offer not found' });
      }
      res.json(offer);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Contrôleur pour archiver une offre de stage
  archiveOffer: async (req, res) => {
    try {
      const offer = await Offer.findByIdAndUpdate(
        req.params.id,
        { status: 'archivé' },
        { new: true }
      );
      if (!offer) {
        return res.status(404).json({ message: 'Offer not found' });
      }
      res.json(offer);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Contrôleur pour récupérer toutes les candidatures pour une offre de stage donnée
  getApplicationsForOffer: async (req, res) => {
    try {
      const applications = await Application.find({
        id: req.params.id,
      });
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteOffreById: async (req, res) => {
    try {
      const offer = await Offer.findByIdAndDelete(req.params.id);
      if (!offer) {
        return res.status(404).json({ message: 'offer not found' });
      }
      res.json({ message: 'Offer deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  publishOffer: async (req, res) => {
    try {
      const offer = await Offer.findById(req.params.id);
      if (!offer) {
        return res.status(404).json({ message: 'Offer not found' });
      }
      offer.status = 'en cours de validation';
      await offer.save();
      res.status(200).json({ message: 'Offer validation in progress' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  republishOffer: async (req, res) => {
    try {
      // Trouver l'offre de stage par son ID dans la base de données
      const offer = await Offer.findById(req.params.id);
      // Vérifier si l'offre de stage existe
      if (!offer) {
        return res.status(404).json({ message: 'Offer not found' });
      }
      // Mettre à jour le statut de l'offre pour la republier
      offer.status = 'publié';
      // Enregistrer les modifications dans la base de données
      await offer.save();

      // Répondre avec un message de succès
      res.status(200).json({ message: 'Offer republished successfully' });
    } catch (error) {
      // Gérer les erreurs
      res.status(500).json({ message: error.message });
    }
  },
  // Contrôleur pour modifier une offre de stage existante si elle est en brouillon
  updateOfferDraft: async (req, res) => {
    try {
      const offer = await Offer.findById(req.params.id);
      if (!offer) {
        return res.status(404).json({ message: 'Offer not found' });
      }
      if (offer.status !== 'brouillon') {
        return res
          .status(400)
          .json({ message: 'Cannot update offer in this status' });
      }
      const updatedOffer = await Offer.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(updatedOffer);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Contrôleur pour valider une offre de stage par le manager
  validateOffer: async (req, res) => {
    try {
      const offer = await Offer.findById(req.params.id);
      if (!offer) {
        return res.status(404).json({ message: 'Offer not found' });
      }
      if (offer.status !== 'en cours de validation') {
        return res
          .status(400)
          .json({ message: 'Offer is not in validation status' });
      }
      offer.status = 'publié';
      await offer.save();
      res.status(200).json({ message: 'Offer validated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Contrôleur pour visualiser les offres de stage pour les étudiants (offres publiées uniquement)
  getPublishedOffersForStudents: async (req, res) => {
    try {
      const publishedOffers = await Offer.find({
        status: 'publié',
      }).populate('domain');
      const modifiedOffers = publishedOffers.map((offer) => {
        const modifiedSkills = offer.skills.map((skill) => ({
          skill: skill.skill,
          level: skill.level,
        }));

        return {
          ...offer.toObject(), // Convert Mongoose document to plain JavaScript object
          domain: {
            _id: offer.domain._id,
            name: offer.domain.name,
          },
          skills: modifiedSkills,
        };
      });

      // Respond with the modified array of offers
      res.status(200).json(modifiedOffers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Contrôleur pour visualiser les offres en cours de validation par le manager
  getNoneValidatedOffers: async (req, res) => {
    try {
      const NoneValidatedOffers = await Offer.find({
        status: 'en cours de validation',
      }).populate('domain');
      const modifiedOffers = NoneValidatedOffers.map((offer) => {
        const modifiedSkills = offer.skills.map((skill) => ({
          skill: skill.skill,
          level: skill.level,
        }));

        return {
          ...offer.toObject(), // Convert Mongoose document to plain JavaScript object
          domain: {
            _id: offer.domain._id,
            name: offer.domain.name,
          },
          skills: modifiedSkills,
        };
      });

      // Respond with the modified array of offers
      res.status(200).json(modifiedOffers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Contrôleur pour gérer les statuts des candidatures pour une offre de stage donnée
  getApplicationStatusesForOffer: async (req, res) => {
    try {
      const applications = await Application.find({ id: req.params.id });
      res.status(200).json(applicationStatuses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Contrôleur pour mettre une offre de stage en brouillon par le responsable RH
  putOfferInDraft: async (req, res) => {
    try {
      const offer = await Offer.findById(req.params.id);
      if (!offer) {
        return res.status(404).json({ message: 'Offer not found' });
      }
      if (offer.status === 'publié') {
        return res
          .status(400)
          .json({ message: 'Cannot put published offer in draft' });
      }
      offer.status = 'brouillon';
      await offer.save();
      res.status(200).json({ message: 'Offer put in draft successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Contrôleur pour supprimer une offre de stage si elle est en brouillon
  deleteOfferDraft: async (req, res) => {
    try {
      const offer = await Offer.findById(req.params.id);
      if (!offer) {
        return res.status(404).json({ message: 'Offer not found' });
      }
      if (offer.status !== 'brouillon') {
        return res
          .status(400)
          .json({ message: 'Cannot delete offer in this status' });
      }
      await offer.remove();
      res.status(200).json({ message: 'Offer deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  searchOffers: async (req, res) => {
    try {
      const { domain, nature, duration, mode } = req.query;
      let query = { status: 'publié' }; // Seules les offres publiées sont visibles par les étudiants

      // Ajoutez les filtres de recherche en fonction des paramètres reçus
      if (domain) {
        query.domain = domain;
      }
      if (nature) {
        query.nature = nature;
      }
      if (duration) {
        query.duration = duration;
      }
      if (mode) {
        query.mode = mode;
      }
      // Effectuer la recherche en fonction des critères spécifiés
      const offers = await Offer.find(query).populate('domain');

      // Répondre avec les offres trouvées
      res.status(200).json(offers);
    } catch (error) {
      // Gérer les erreurs
      res.status(500).json({ message: error.message });
    }
  },
  gethistorique_offres: async (req, res) => {
    try {
      // Récupérer les offres archivées ou précédemment publiées
      const historicalOffers = await Offer.find({
        status: { $in: ['archivé', 'publié'] },
      });

      res.status(200).json(historicalOffers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
