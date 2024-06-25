const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'sgce.plateform@gmail.com',
    pass: 'cacvghcpsqwzouyo',
  },
});
// Fonction pour envoyer le code de confirmation par e-mail
module.exports.sendCodeConfirmationEmail = (email, confirmationCode) => {
  let mailOptions = {
    from: 'sgce.plateform@gmail.com',
    to: email,
    subject: 'Confirmation de votre adresse e-mail',
    text: `Votre code de confirmation est : ${confirmationCode}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('E-mail sent: ' + info.response);
    }
  });
};
// Fonction pour envoyer la confirmation du postule par e-mail
module.exports.sendapplicationConfirmationEmail = (email, offer) => {
  const mailOptions = {
    from: 'sgce.plateform@gmail.com',
    to: email,
    subject: 'Confirmation de candidature',
    text: `Votre candidature pour le poste ${offer} a été envoyée avec succès. Nous l'examinerons attentivement et vous contacterons prochainement avec une réponse.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('E-mail sent: ' + info.response);
    }
  });
};
module.exports.sendinterviewConfirmationEmail = (
  email,
  interviewDateTime,
  interviewMode,
  interviewLink,
  interviewLocation,
  interviewType
) => {
  // Contenu de l'e-mail
  const mailOptions = {
    from: 'sgce.plateform@gmail.com',
    to: email, // Adresse e-mail du destinataire (candidat)
    subject: `Entretien ${interviewType} ${interviewMode} programmé`,
    text:
      interviewMode === 'présentiel'
        ? `Cher candidat,\n\nVotre entretien a été programmé pour le ${interviewDateTime} à : ${interviewLocation}. Nous avons hâte de vous rencontrer!\n\nCordialement,\nL'équipe RH`
        : `Cher candidat,\n\nVotre entretien a été programmé pour le ${interviewDateTime} en ligne .\n\n Merci de nous rejoindre via ce lien : ${interviewLink}. Nous avons hâte de vous rencontrer!\n\nCordialement,\nL'équipe RH`,
  };
  // Envoi de l'e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('E-mail sent: ' + info.response);
    }
  });
};
module.exports.sendFinalDecisionForApplication = (
  email,
  validationComment,
  rejectionReason,
  status,
  startDate
) => {
  // Contenu de l'e-mail
  const mailOptions = {
    from: 'sgce.plateform@gmail.com',
    to: email, // Adresse e-mail du destinataire (candidat)
    subject: `Résultat Finale de votre candidature`,
    text:
      status === 'accepté'
        ? `Nous avons le plaisir de vous informer que votre candidature a été acceptée.Votre stage commencera le ${startDate}\n\nCordialement,\nL'équipe RH`
        : `Nous vous remercions d'avoir postulé au stage au sein de notre entreprise. Après une analyse attentive de votre candidature, nous avons le regret de vous informer que nous ne donnerons pas une suite favorable à votre demande.\n\nCordialement,\nL'équipe RH`,
  };
  // Envoi de l'e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('E-mail sent: ' + info.response);
    }
  });
};

