const mongoose = require('mongoose');
const Skill = require('./skill'); 

// Définition du schéma pour le modèle de domaine
const domainSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true // Assure que chaque nom de domaine est unique
    },
    skills: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill'
     }] // Utilisation du schéma du modèle de compétence

});

// Création du modèle de domaine à partir du schéma
module.exports = mongoose.model('Domain', domainSchema);


