const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    level: {
        type: String,
        enum: ['connaissance théorique', 'connaissance pratique', 'débutant', 'intermédiaire', 'maîtrise'],
    }
});

module.exports = mongoose.model('Skill', skillSchema);
