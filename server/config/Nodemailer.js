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
module.exports.sendapplicationConfirmationEmail = (email) => {
  const mailOptions = {
    from: 'sgce.plateform@gmail.com',
    to: email,
    subject: 'Confirmation de candidature',
    text: 'Votre candidature a été enregistrée avec succès. Merci de postuler avec nous.',
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
  interviewLocation
) => {
  // Contenu de l'e-mail
  const mailOptions = {
    from: 'sgce.plateform@gmail.com',
    to: email, // Adresse e-mail du destinataire (candidat)
    subject: 'Entretien programmé',
    text: `Cher candidat,\n\nVotre entretien a été programmé pour le ${interviewDateTime} à ${interviewLocation}. Nous avons hâte de vous rencontrer!\n\nCordialement,\nL'équipe RH`,
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
