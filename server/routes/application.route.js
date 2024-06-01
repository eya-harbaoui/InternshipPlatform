const express = require('express');
const router = express.Router();
const applicationController = require('../Controllers/applicationContoller');

router.get(
  '/historique_candidatures/:id',
  applicationController.getcandidatures
);
router.get(
  '/candidatures_by_interviewer/:id',
  applicationController.getcandidaturesByInterviewer
);
router.put('/update_candidature/:id', applicationController.updateApplication);
router.get('/candidature_by_Id/:id', applicationController.getApplicationById);
router.post('/postuler', applicationController.postuler);
router.post('/refuser', applicationController.refuseApplication);
router.post('/schedule_interview', applicationController.scheduleInterview);
module.exports = router;
