const express = require('express');
const router = express.Router();
const offerController = require('../Controllers/offerController');

router.get('/', offerController.getAllOffers);
router.get('/students', offerController.getPublishedOffersForStudents);
router.get('/none_validated_offres', offerController.getNoneValidatedOffers);
router.get('/search', offerController.searchOffers);
router.get('/:id', offerController.getOfferById);
router.get('/historique_offres', offerController.gethistorique_offres);
router.get('/applications/:id', offerController.getApplicationsForOffer);
//router.get('/application-statuses/:id', offerController.getApplicationStatusesForOffer);
router.post('/', offerController.createOffer);
router.put('/:id', offerController.updateOffer);
router.put('/draft/:id', offerController.updateOfferDraft);
router.put('/publish/:id', offerController.publishOffer);
router.put('/republish/:id', offerController.republishOffer);
router.put('/indraft/:id', offerController.putOfferInDraft);
router.put('/validate/:id', offerController.validateOffer);
router.patch('/archive/:id', offerController.archiveOffer);
router.delete('/:id', offerController.deleteOffreById);
router.delete('/draft/:id', offerController.deleteOfferDraft);

module.exports = router;
