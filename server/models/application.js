const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    offer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer',
        required: true
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['en cours', 'entretien programmé', 'refusé', 'entretien technique confirmé', 'entretien RH confirmé', 'accepté'],
        required: true
    },
    rejectionReason: String,
    interviewDateTime: Date,
    interviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    interviewLocation: String,
    validationComment: String,
    rejectionReason: String
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
