const express = require('express');
const router = express.Router();
const statController = require('../Controllers/statController'); // Assuming this is your controller file path

// Offers statistics routes
router.get('/offers/by-year', statController.getPublishedOffersByYear);
router.get('/offers/by-month', statController.getPublishedOffersByMonth);

// Applications statistics routes
router.get('/applications/by-month', statController.getApplicationsByMonth); // Use query parameters for filtering
router.get(
  '/applications/rejected/by-month',
  statController.getRejectedApplicationsByMonth
);
router.get(
  '/applications/accepted/by-month',
  statController.getAcceptedApplicationsByMonth
);
router.get(
  '/applications/received/by-month',
  statController.getReceivedApplicationsByMonth
);
router.get('/offers/by-domain', statController.getOffersByDomain);
module.exports = router;
