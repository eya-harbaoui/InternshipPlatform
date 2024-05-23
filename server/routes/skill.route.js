const express = require('express');
const router = express.Router();
const skillController = require('../Controllers/skillController');

router.get('/', skillController.getAllSkills);
router.get('/:id', skillController.getSkillById);
router.post('/', skillController.createSkill);
router.put('/:id', skillController.updateSkillById);
router.delete('/:id', skillController.deleteSkillById);

module.exports = router;
