const express = require('express');
const router = express.Router();
const domainController = require('../Controllers/domainController');

router.get('/', domainController.getAllDomains);
router.get('/:id', domainController.getDomainById);
router.post('/', domainController.createDomain);
router.put('/:id', domainController.updateDomainById);
router.delete('/:id', domainController.deleteDomainById);

module.exports = router;
