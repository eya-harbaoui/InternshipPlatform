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
import { RHNavbarLinks } from "../../components/Navbar/RHNavbarLinks"; // Importation des liens de navigation pour le recrutement
import Navbar from "../../components/Navbar/Navbar"; // Importation du composant de barre de navigation
import axios from "axios"; // Importation du module Axios pour les requêtes HTTP
import { useParams } from "react-router-dom"; // Importation du hook useParams pour extraire les paramètres d'URL
import CompetenceDetails from "../../components/CandidatureCard/CompetenceDetails";
import getUserIdFromLocalStorage from "../../UserAuth.js";

// Définition du composant ListeCandidatures
const ListeCandidaturesRH = () => {
  const { role, userId } = getUserIdFromLocalStorage() || {};
  const { Option } = Select;
  const [candidatures, setCandidatures] = useState({}); //va contenir le nbre de chaque candidatures selon le status d'une offre spécifique
  const [candidats, setCandidats] = useState([]); //va contenir les candidatures avec des details d'une offre specifiques
  const [selectedCandidature, setSelectedCandidature] = useState(null);
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false); // Déclaration de l'état pour le modal de programmation d'entretien
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false); // Déclaration de l'état pour le modal d'acceptation de candidat
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // Déclaration de l'état pour le modal d'affichage de profil de candidat
  const [isCandidatureFileModalOpen, setIsCandidatureFileModalOpen] =
    useState(false); // Déclaration de l'état pour le modal d'affichage de fiche de candidature
  const [isRefuseModalOpen, setIsRefuseModalOpen] = useState(false); // Déclaration de l'état pour le modal de refus de candidat
  const [acceptMessage, setAcceptMessage] = useState(""); // Déclaration de l'état pour le message d'acceptation de candidat
  const [refuseMessage, setRefuseMessage] = useState(""); // Déclaration de l'état pour le message de refus de candidat
  const [interview, setInterview] = useState({
    // Déclaration de l'état pour les détails de l'entretien
    id: "",
    CandidatureId: "",
    type: "",
    interviewDateTime: null,
    mode: "",
    address: "",
    link: "",
    technicalValidatorId: null,
  });
  const [refuseOption, setRefuseOption] = useState("");

  const [technicalValidators, setTechnicalValidators] = useState([]); // Déclaration de l'état pour stocker les validateurs techniques sélectionnables
  const [selectedTechnicalValidator, setSelectedTechnicalValidator] =
    useState(null); // Déclaration de l'état pour le validateur technique sélectionné

  // Liste des raisons de refus de candidature
  const refuseReasons = [
    "Profil non conforme aux attentes",
    "Manque d'expérience professionnelle",
    "Autre opportunité professionnelle",
    "Motivation insuffisante",
    "Compétences techniques non adaptées",
  ];

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

  // Fonction pour récupérer les validateurs techniques
  const fetchTechnicalValidators = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/users/role/Validator"
      );
      setTechnicalValidators(response.data);
      console.log(technicalValidators, "teeech");
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des validateurs techniques :",
        error
      );
    }
  };

  // Effet pour charger les données des candidatures et des validateurs techniques
  useEffect(() => {
    getStudentApplicationsForOffer();
    fetchTechnicalValidators();
  });

  const handleDateChange = (value) => {
    setInterview({
      ...interview,
      interviewDateTime: value ? value.format("YYYY-MM-DD HH:mm:ss") : null,
    });
  };

  // Fonction pour gérer la programmation d'un entretien
  const handleProgramInterview = (candidat) => {
    setSelectedCandidature(candidat);
    const type = candidat.status === "en cours" ? "technique" : "RH";
    setInterview({ ...interview, type: type });
    showModal();
  };

  // Fonction pour envoyer les détails de l'entretien au serveur
  const sendInterview = async () => {
    try {
      // Mise à jour du statut de la candidature après la programmation de l'entretien
      const technicallyEvaluated = interview.type == "RH" ? true : false;
      const newStatus =
        interview.type === "RH"
          ? "entretien RH programmé"
          : "entretien technique programmé";
      const interviewLocation =
        interview.mode === "présentiel" ? interview.address : "";
      const interviewLink = interview.mode === "en ligne" ? interview.link : "";
      const updatedCandidature = {
        applicationId: selectedCandidature._id,
        email: selectedCandidature.applicant.email,
        status: newStatus,
        interviewer: selectedTechnicalValidator,
        technicallyEvaluated: technicallyEvaluated,
        interviewDateTime: interview.interviewDateTime,
        interviewMode: interview.mode,
        interviewLocation: interviewLocation,
        interviewLink: interviewLink,
        interviewType: interview.type,
      };
      console.log(updatedCandidature, "sending interview");

      // Mise à jour de la candidature sur le serveur
      await axios.post(
        "http://localhost:8000/application/schedule_interview",
        updatedCandidature
      );

      setIsModalOpen(false); // Fermeture du modal après l'envoi des détails de l'entretien
    } catch (error) {
      console.error("Erreur lors de la programmation de l'entretien", error);
    }
  };

  // Fonction pour afficher le modal de programmation d'entretien
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Fonction pour annuler la programmation d'entretien
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Fonction pour accepter un candidat
  const acceptCandidate = (candidat) => {
    setSelectedCandidature(candidat);
    setIsAcceptModalOpen(true);
  };

  // Fonction pour traiter l'acceptation d'un candidat
  const handleAcceptModalOk = async () => {
    try {
      const status =
        selectedCandidature.status === "entretien RH programmé"
          ? "entretien RH confirmé"
          : "accepté";
      const updatedCandidature = {
        ...selectedCandidature,
        status: status,
        validationComment: acceptMessage,
      };

      // Mise à jour de la candidature sur le serveur après acceptation
      await axios.put(
        `http://localhost:8000/application/update_candidature/${selectedCandidature._id}`,
        updatedCandidature
      );

      setIsAcceptModalOpen(false); // Fermeture du modal après l'acceptation du candidat
    } catch (error) {
      console.error("Erreur lors de l'acceptation du candidat", error);
    }
  };

  // Fonction pour annuler l'acceptation d'un candidat
  const handleAcceptModalCancel = () => {
    setIsAcceptModalOpen(false);
  };

  // Fonction pour refuser un candidat
  const refuseCandidate = (candidat) => {
    setSelectedCandidature(candidat);
    setIsRefuseModalOpen(true);
  };

  // Fonction pour traiter le refus d'un candidat
  const handleRefuseModalOk = async () => {
    try {
      await axios.put(
        `http://localhost:8000/application/update_candidature/${selectedCandidature._id}`,
        {
          ...selectedCandidature,
          status: "refusé",
          rejectionReason: refuseMessage,
        }
      );
      setIsRefuseModalOpen(false); // Fermeture du modal après le refus du candidat
    } catch (error) {
      console.error("Erreur lors du refus du candidat", error);
    }
  };

  const confirmRHInterview = async () => {
    try {
      await axios.put(
        `http://localhost:8000/application/update_candidature/${selectedCandidature._id}`,
        {
          ...selectedCandidature,
          status: "entretien RH confirmé",
        }
      );
      setIsRefuseModalOpen(false); // Fermeture du modal après le refus du candidat
    } catch (error) {
      console.error("Erreur lors du refus du candidat", error);
    }
  };

  // Fonction pour annuler le refus d'un candidat
  const handleRefuseModalCancel = () => {
    setIsRefuseModalOpen(false);
  };

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
      name:
        candidat.status === "en cours"
          ? "Programmer un entretien technique"
          : candidat.status === "entretien technique confirmé"
          ? "Programmer un entretien RH"
          : "Programmer un entretien",
      onClick: () => handleProgramInterview(candidat), // Pass function reference
      disabled:
        candidat.status !== "en cours" &&
        candidat.status !== "entretien technique confirmé",
      Icon: BsCalendar,
    },
    {
      name: "Fiche candidature",
      onClick: () => viewCandidatureFile(candidat), // Pass function reference
      disabled: candidat.status === "en cours",
      Icon: FaRegUser,
    },
    {
      name: "accepter",
      onClick: () => acceptCandidate(candidat), // Pass function reference
      disabled:
        candidat.status == "refusé" ||
        candidat.status === "accepté" ||
        candidat.status === "en cours" ||
        candidat.status === "entretien technique programmé" ||
        candidat.status === "entretien technique confirmé",
      Icon: BsPersonCheck,
    },
    {
      name: "refuser",
      onClick: () => refuseCandidate(candidat), // Pass function reference
      disabled:
        candidat.status === "accepté" ||
        candidat.status === "refusé" ||
        candidat.status === "entretien technique programmé" ||
        candidat.status === "entretien technique confirmé",
      Icon: BsPersonDash,
    },
  ];

  // Retourner le contenu JSX de la page
  return (
    <div className="offres-page">
      <Navbar links={RHNavbarLinks(userId)} />
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
      {/*Affichage du modal pour la programmation d'un entretien*/}
      {isModalOpen && (
        <Modal
          title="Programmer un entretien"
          visible={isModalOpen}
          onOk={sendInterview}
          onCancel={handleCancel}
          okText="Envoyer un email au candidat"
          cancelText="Annuler l'envoie"
        >
          <div className="modal-content">
            <h3>Porgrammer un entretien {interview.type} </h3>

            <h3>Date et heure de l'entretien</h3>

            <DatePicker showTime onChange={handleDateChange} />

            <h3>Mode de l'entretien</h3>
            <Radio.Group
              onChange={(e) =>
                setInterview({ ...interview, mode: e.target.value })
              }
              value={interview.mode}
            >
              <Radio value="en ligne">En ligne</Radio>
              <Radio value="présentiel">Présentiel</Radio>
            </Radio.Group>

            {interview.mode === "présentiel" && (
              <>
                <h3>Adresse de l'entretien</h3>
                <Input
                  placeholder="Adresse de l'entretien"
                  onChange={(e) =>
                    setInterview({ ...interview, address: e.target.value })
                  }
                  value={interview.address}
                />
              </>
            )}

            {interview.mode === "en ligne" && (
              <>
                <h3>Lien de l'entretien</h3>
                <Input
                  placeholder="Lien de l'entretien en ligne"
                  onChange={(e) =>
                    setInterview({ ...interview, link: e.target.value })
                  }
                  value={interview.link}
                />
              </>
            )}

            {interview.type === "technique" && (
              <>
                <h3>Validateur technique</h3>
                <Select
                  placeholder="Sélectionnez un validateur technique"
                  style={{ width: "100%" }}
                  onChange={(value) => setSelectedTechnicalValidator(value)}
                  value={selectedTechnicalValidator}
                >
                  {technicalValidators.map((validator) => (
                    <Option key={validator._id} value={validator._id}>
                      {`${validator.firstName} ${validator.lastName}`}
                    </Option>
                  ))}
                </Select>
              </>
            )}
          </div>
        </Modal>
      )}
      {/* Affichage du modal pour l'acceptation d'un candidat*/}
      {isAcceptModalOpen && (
        <Modal
          title="Accepter le candidat"
          visible={isAcceptModalOpen}
          onOk={handleAcceptModalOk}
          onCancel={handleAcceptModalCancel}
          okText="Accepter"
          cancelText="Annuler"
        >
          <Input
            placeholder="Ajouter un message personnalisé"
            value={acceptMessage}
            onChange={(e) => setAcceptMessage(e.target.value)}
          />
        </Modal>
      )}
      {/* Affichage du modal pour le refus d'un candidat*/}
      {isRefuseModalOpen && (
        <Modal
          title="Refuser le candidat"
          visible={isRefuseModalOpen}
          onOk={handleRefuseModalOk}
          onCancel={handleRefuseModalCancel}
          okText="Refuser"
          cancelText="Annuler"
        >
          <Radio.Group
            onChange={(e) => setRefuseOption(e.target.value)}
            value={refuseOption}
          >
            <Radio value="personalMessage">Tapez un message personnel</Radio>
            <Radio value="selectReason">Sélectionner une raison</Radio>
          </Radio.Group>
          {refuseOption === "personalMessage" ? (
            <Input
              placeholder="Motif de refus"
              style={{ width: "100%" }}
              onChange={(e) => setRefuseMessage(e.target.value)}
              value={refuseMessage}
            />
          ) : (
            <Select
              placeholder="Motif de refus"
              style={{ width: "100%" }}
              onChange={(value) => setRefuseMessage(value)}
              value={refuseMessage}
            >
              {refuseReasons.map((reason) => (
                <Option key={reason} value={reason}>
                  {reason}
                </Option>
              ))}
            </Select>
          )}
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

export default ListeCandidaturesRH; // Exportation du composant ListeCandidatures
