const Domain = require('../models/domain');

module.exports = {
  // Fonction pour créer un nouveau domaine
  createDomain: async (req, res) => {
    try {
      const newDomain = new Domain(req.body);
      await newDomain.save();
      res.status(201).json(newDomain);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Fonction pour récupérer tous les domaines
  getAllDomains: async (req, res) => {
    try {
      const domains = await Domain.find().populate({
        path: 'skills', 
        select: 'name', 
      });
      res.json(domains);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Fonction pour récupérer un domaine par son ID
  getDomainById: async (req, res) => {
    try {
      const domain = await Domain.findById(req.params.id);
      if (!domain) {
        return res.status(404).json({ message: 'Domain not found' });
      }
      res.json(domain);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Fonction pour mettre à jour un domaine par son ID
  updateDomainById: async (req, res) => {
    try {
      const domain = await Domain.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!domain) {
        return res.status(404).json({ message: 'Domain not found' });
      }
      res.json(domain);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Fonction pour supprimer un domaine par son ID
  deleteDomainById: async (req, res) => {
    try {
      const domain = await Domain.findByIdAndDelete(req.params.id);
      if (!domain) {
        return res.status(404).json({ message: 'Domain not found' });
      }
      res.json({ message: 'Domain deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteDomain: async (req, res) => {
    try {
      const domain = await Domain.findByIdAndDelete(req.params.id);
      if (!domain) {
        return res.status(404).json({ message: 'Domain not found' });
      }
      res.json({ message: 'Domain deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
