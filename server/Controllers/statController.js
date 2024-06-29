const Application = require('../models/application');
const Offer = require('../models/offer');

async function getApplicationsByMonth(req, res) {
  try {
    const { status } = req.body;
    const matchCondition = status ? { status } : { status: { $ne: 'refusé' } };

    const applicationsByMonth = await Application.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthNames = [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre',
    ];
    const formattedResults = applicationsByMonth.map(
      (item) =>
        `${monthNames[item._id.month - 1]} ${item._id.year}: ${
          item.count
        } candidatures`
    );

    res.json(formattedResults);
  } catch (error) {
    console.error('Erreur lors de la récupération des candidatures:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = {
  getPublishedOffersByYear: async (req, res) => {
    try {
      const offersByYear = await Offer.aggregate([
        { $match: { status: 'publié' } },
        { $group: { _id: { $year: '$createdAt' }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]);

      const formattedResults = offersByYear.map(
        (item) => `${item._id}: ${item.count} offres publiées`
      );
      res.json(formattedResults);
    } catch (error) {
      console.error('Erreur lors de la récupération des offres:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  getPublishedOffersByMonth: async (req, res) => {
    try {
      const offersByMonth = await Offer.aggregate([
        { $match: { status: 'publié' } },
        {
          $group: {
            _id: {
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]);

      const monthNames = [
        'Janvier',
        'Février',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Août',
        'Septembre',
        'Octobre',
        'Novembre',
        'Décembre',
      ];
      const formattedResults = offersByMonth.map(
        (item) =>
          `${monthNames[item._id.month - 1]} ${item._id.year}: ${
            item.count
          } offres publiées`
      );
      res.json(formattedResults);
    } catch (error) {
      console.error('Erreur lors de la récupération des offres:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  getApplicationsByMonth: getApplicationsByMonth,

  getRejectedApplicationsByMonth: async (req, res) => {
    req.body.status = 'refusé';
    await getApplicationsByMonth(req, res);
  },

  getAcceptedApplicationsByMonth: async (req, res) => {
    req.body.status = 'accepté';
    await getApplicationsByMonth(req, res);
  },

  getReceivedApplicationsByMonth: async (req, res) => {
    await getApplicationsByMonth(req, res);
  },
};
