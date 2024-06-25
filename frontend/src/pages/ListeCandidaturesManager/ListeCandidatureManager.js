import React, { useState, useEffect } from "react"; // Importation des hooks useState et useEffect depuis React
import {
  Select,
  Row,
  Col,
  Modal,
  Input,
  Radio,
  Button,
  DatePicker,
} from "antd"; // Importation de certains composants depuis Ant Design
import { FaRegUser } from "react-icons/fa"; // Importation de l'icône d'utilisateur depuis React Icons
import { BsCalendar, BsPersonCheck, BsPersonDash } from "react-icons/bs"; // Importation d'icônes de calendrier, de validation et de refus depuis React Icons
import CandidatsCard from "../../components/CandidatsCard/CandidatsCard"; // Importation d'un composant de carte de candidats
import ListeCandidatureCard from "../../components/CandidatureCard/ListeCandidatureCard"; // Importation d'un composant de carte de candidature
import { ManagerNavbarLinks } from "../../components/Navbar/ManagerNavbarLinks.js"; // Importation des liens de navigation pour le recrutement
import Navbar from "../../components/Navbar/Navbar"; // Importation du composant de barre de navigation
import axios from "axios"; // Importation du module Axios pour les requêtes HTTP
import { useParams } from "react-router-dom"; // Importation du hook useParams pour extraire les paramètres d'URL
import CompetenceDetails from "../../components/CandidatureCard/CompetenceDetails";
import getUserIdFromLocalStorage from "../../UserAuth.js";

// Définition du composant ListeCandidatures
const ListeCandidatureManager = () => {
  const { role, userId } = getUserIdFromLocalStorage() || {};
  const { Option } = Select;
  const [candidatures, setCandidatures] = useState({}); //va contenir le nbre de chaque candidatures selon le status d'une offre spécifique
  const [candidats, setCandidats] = useState([]); //va contenir les candidatures avec des details d'une offre specifiques
  const [selectedCandidature, setSelectedCandidature] = useState(null);
  const { id } = useParams();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // Déclaration de l'état pour le modal d'affichage de profil de candidat
  const [isCandidatureFileModalOpen, setIsCandidatureFileModalOpen] =
    useState(false); // Déclaration de l'état pour le modal d'affichage de fiche de candidature

  // Fonction pour récupérer les candidatures étudiantes pour une offre spécifique
  const getStudentApplicationsForOffer = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/offre/applications/${id}`
      );

      const candidatsWithInfo = response.data;
      console.log("Candidats avec informations:", candidatsWithInfo);
      const countByStatus = candidatsWithInfo.reduce((acc, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
      }, {});

      console.log("Nombre de candidatures par statut:", countByStatus);

      setCandidats(candidatsWithInfo);

      setCandidatures(countByStatus);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des candidatures étudiantes :",
        error
      );
    }
  };

  // Effet pour charger les données des candidatures et des validateurs techniques
  useEffect(() => {
    getStudentApplicationsForOffer();
  });

  // Fonction pour afficher le profil d'un candidat
  const viewProfile = (candidat) => {
    setSelectedCandidature(candidat);
    console.log("pp", selectedCandidature);
    setIsProfileModalOpen(true);
  };

  // Fonction pour annuler l'affichage du profil d'un candidat
  const viewProfileCancel = () => {
    setIsProfileModalOpen(false);
  };

  // Fonction pour afficher la fiche de candidature d'un candidat
  const viewCandidatureFile = (candidat) => {
    setSelectedCandidature(candidat);
    console.log("vv", selectedCandidature);
    setIsCandidatureFileModalOpen(true);
  };

  // Fonction pour annuler l'affichage de la fiche de candidature d'un candidat
  const viewCandidatureFileCancel = () => {
    setIsCandidatureFileModalOpen(false);
  };

  // Fonction pour définir les actions disponibles pour chaque statut de candidature
  const actions = (candidat) => [
    {
      name: "Fiche candidature",
      onClick: () => viewCandidatureFile(candidat), // Pass function reference
      disabled: candidat.status === "en cours",
      Icon: FaRegUser,
    },
  ];

  // Retourner le contenu JSX de la page
  return (
    <div className="offres-page">
      <Navbar links={ManagerNavbarLinks(userId)} />{" "}
      {/* Affichage de la barre de navigation*/}
      <h3 className="title-offre">Liste des candidats</h3>{" "}
      {/* Affichage du titre
      de la page*/}
      <FaRegUser className="icon-offre" />{" "}
      {/* Affichage de l'icône de candidat*/}
      <Row gutter={[16, 16]}>
        {/* Affichage des cartes de statut de candidature*/}
        {Object.entries(candidatures).map(([status, count]) => (
          <Col key={status} xs={24} sm={12} md={8} lg={6}>
            <CandidatsCard status={status} nombreCandidats={count} />
          </Col>
        ))}
      </Row>
      {/* Affichage des cartes de candidatures */}
      {candidats.map((candidat) => (
        <ListeCandidatureCard
          key={candidat._id}
          status={candidat.status}
          title={
            candidat.applicant.firstName + " " + candidat.applicant.lastName
          }
          createdAt={candidat.createdAt}
          actions={actions(candidat)}
          statusRefusePopover={candidat.rejectionReason}
          onClickTitle={() => {
            viewProfile(candidat);
          }}
        />
      ))}
      {/* Affichage du modal pour visualiser le profil d'un candidat*/}
      {isProfileModalOpen && (
        <Modal
          title="Profil du candidat"
          visible={isProfileModalOpen}
          onOk={viewProfileCancel}
          onCancel={viewProfileCancel}
          footer={[
            <Button key="ok" type="primary" onClick={viewProfileCancel}>
              Fermer
            </Button>,
          ]}
        >
          <div>
            <p>
              <strong>Nom et prénom: </strong>{" "}
              {selectedCandidature.applicant.firstName}{" "}
              {selectedCandidature.applicant.lastName}
            </p>
            <p>
              <strong>Email: </strong> {selectedCandidature.applicant.email}
            </p>
            <p>
              <strong>Téléphone: </strong>{" "}
              {selectedCandidature.applicant.phoneNumber}
            </p>
            <p>
              <strong>Niveau: </strong>{" "}
              {selectedCandidature.applicant.studyLevel}
            </p>
            <p>
              <strong>Etablissement: </strong>{" "}
              {selectedCandidature.applicant.establishment}
            </p>
            <p>
              <strong>CV: </strong> {selectedCandidature.applicant.cv}
            </p>
            <p>
              <strong>Adresse: </strong> {selectedCandidature.applicant.address}
            </p>
            <label htmlFor="stageDescription">
              <strong>Lettre de recommendation :</strong>
            </label>
            <textarea
              type="text"
              placeholder="Lettre de recommendation"
              className="textarea-design"
              value={selectedCandidature.applicant.recommendationLetter}
            />
          </div>
        </Modal>
      )}
      {/* Affichage du modal pour la fiche de candidature*/}
      {isCandidatureFileModalOpen && (
        <Modal
          title="Fiche de candidature"
          visible={isCandidatureFileModalOpen}
          onOk={viewCandidatureFileCancel}
          onCancel={viewCandidatureFileCancel}
          okText="Fermer"
          footer={[
            <Button key="ok" type="primary" onClick={viewCandidatureFileCancel}>
              Fermer
            </Button>,
          ]}
        >
          <div>
            <p>
              <strong>Nom et prénom du candidat: </strong>{" "}
              {selectedCandidature.applicant.firstName}{" "}
              {selectedCandidature.applicant.lastName}
            </p>
            <p>
              <strong>Titre de stage:</strong> {selectedCandidature.offer.title}
            </p>
            <p>
              <strong>Date de candidature:</strong>{" "}
              {selectedCandidature.offer.createdAt}
            </p>
            <p>
              <strong>Statut de candidature:</strong>{" "}
              {selectedCandidature.status}
            </p>
            <p>
              <strong>Date et heure de l'entretien:</strong>{" "}
              {selectedCandidature.interviewDateTime}
            </p>

            {!selectedCandidature.technicallyEvaluated && (
              <div className="competences-container">
                <h4>Compétences demandées :</h4>
                {selectedCandidature.offer.skills.map((skillItem) => (
                  <div key={skillItem.skill._id}>
                    <p>
                      {skillItem.skill.name} : {skillItem.level}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {selectedCandidature.technicallyEvaluated && (
              <div>
                <CompetenceDetails
                  candidatureId={selectedCandidature._id}
                ></CompetenceDetails>
              </div>
            )}

            {selectedCandidature.refuseReason && (
              <p>
                <strong>Raison de refus:</strong>{" "}
                {selectedCandidature.refuseReason}
              </p>
            )}
            {selectedCandidature.acceptMessage && (
              <p>
                <strong>Message d'acceptation:</strong>{" "}
                {selectedCandidature.acceptMessage}
              </p>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ListeCandidatureManager; // Exportation du composant ListeCandidatures
