const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    period: {
        type: Number,
        required: true
    },
    domain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Domain',
        required: true
    },
    mode: {
        type: String,
        enum: ['présentiel', 'remote', 'hybride'],
        required: true
    },
    nature:{
        type: String,
        enum: ['initiation', 'PFA', 'PFE'],
        required: true
    },
    skills: [{
        skill: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Skill',
            required: true
        },
        level: {
            type: String,
            enum: ['connaissance théorique', 'connaissance pratique', 'débutant', 'intermédiaire', 'maîtrise'],
            required: true
        }
    }],
    status: {
        type: String,
        enum: ['brouillon', 'en cours de validation', 'publié', 'archivé'],
        default: 'brouillon'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    validatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);
