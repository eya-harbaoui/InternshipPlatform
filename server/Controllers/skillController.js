const Skill = require('../models/skill');

module.exports = {
    // Créer une nouvelle compétence
    createSkill: async (req, res) => {
        try {
            const newSkill = new Skill(req.body);
            await newSkill.save();
            res.status(201).json(newSkill);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Obtenir toutes les compétences
    getAllSkills: async (req, res) => {
        try {
            const Skills = await Skill.find();
            res.json(Skills);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },


    // Mettre à jour une compétence par son ID
    updateSkillById: async (req, res) => {
        try {
            const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!skill) {
                return res.status(404).json({ message: 'skill not found' });
            }
            res.json(skill);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Supprimer une compétence par son ID
    deleteSkillById: async (req, res) => {
        try {
            const skill = await Skill.findByIdAndDelete(req.params.id);
            if (!skill) {
                return res.status(404).json({ message: 'skill not found' });
            }
            res.json({ message: 'skill deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    // Obtenir une compétence par son ID
    getSkillById: async (req, res) => {
        try {
            const skill = await Skill.findById(req.params.id);
            if (!skill) {
                return res.status(404).json({ message: 'skill not found' });
            }
            res.json(skill);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

}
