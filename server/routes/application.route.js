const express = require('express');
const router = express.Router();
const applicationController = require('../Controllers/applicationContoller');

router.get('/historique_condidatures', applicationController.getcandidatures);
router.post('/postuler', applicationController.postuler);
router.post('/refuser', applicationController.refuseApplication);
router.post('/schedule_interview', applicationController.scheduleInterview);
module.exports = router;
