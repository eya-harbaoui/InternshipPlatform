const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    offer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Offer',
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: [
        'en cours',
        'entretien technique programmé',
        'entretien RH programmé',
        'refusé',
        'entretien technique confirmé',
        'entretien RH confirmé',
        'accepté',
      ],
      required: true,
    },
    applicantSkills: [
      {
        skill: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Skill',
          required: true,
        },
        levelRequired: {
          type: String,
          enum: [
            'aucune compétence',
            'connaissance théorique',
            'connaissance pratique',
            'débutant',
            'intermédiaire',
            'maîtrise',
          ],
          required: true,
        },
        levelAcquired: {
          type: String,
          enum: [
            'aucune compétence',
            'connaissance théorique',
            'connaissance pratique',
            'débutant',
            'intermédiaire',
            'maîtrise',
          ],
          required: true,
        },
        adequacyPercentage: {
          type: Number,
          required: true,
        },
      },
    ],
    adequacyPercentage: Number,
    interviewDateTime: Date,
    interviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    interviewLocation: String,
    interviewMode: String,
    interviewLink: String,
    validationComment: String,
    rejectionReason: String,
    technicallyEvaluated: Boolean,
    interviewType: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
