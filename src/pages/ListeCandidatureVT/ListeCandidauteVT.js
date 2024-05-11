import React, { useState, useEffect } from "react";
import { Select, Row, Col, Modal, DatePicker, Input, Radio } from "antd";
import { FaRegUser } from "react-icons/fa";
import { BsCalendar, BsPersonCheck, BsPersonDash } from "react-icons/bs";
import CandidatsCard from "../../components/CandidatsCard/CandidatsCard";
import ListeCandidatureCard from "../../components/CandidatureCard/ListeCandidatureCard";
import { VTNavbarLinks } from "../../components/Navbar/VTNavbarLinks";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import { useParams } from "react-router-dom";
import { SkillsLevel } from "../../components/OffresCard/SkillsLevel";
const ListeCandidaturesVT = () => {
  const { Option } = Select;
  const [candidatures, setCandidatures] = useState({});
  const [candidats, setCandidats] = useState([]);
  const [selectedCandidature, setSelectedCandidature] = useState(null);
  const { id } = useParams();
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCandidatureFileModalOpen, setIsCandidatureFileModalOpen] =
    useState(false);
  const [isRefuseModalOpen, setIsRefuseModalOpen] = useState(false);
  const [acceptMessage, setAcceptMessage] = useState("");
  const [refuseMessage, setRefuseMessage] = useState("");
  const [competenceLevels, setCompetenceLevels] = useState({});
  const [adequacyPercentage, setAdequacyPercentage] = useState(0);
  const [selectedNiveaux, setSelectedNiveaux] = useState({});

  const refuseReasons = [
    "Profil non conforme aux attentes",
    "Manque d'expérience professionnelle",
    "Autre opportunité professionnelle",
    "Motivation insuffisante",
    "Compétences techniques non adaptées",
  ];

  const getStudentApplicationsForOffer = async () => {
    console.log(id, "idddddddddd");
    try {
      const response = await axios.get(
        `http://localhost:8000/Student_Application?technicalValidatorId=${id}`
      );

      const candidatsWithInfo = await Promise.all(
        response.data.map(async (candidature) => {
          const studentResponse = await axios.get(
            `http://localhost:8000/Students/${candidature.studentId}`
          );

          const interviewResponse = await axios.get(
            `http://localhost:8000/Interviews?CandidatureId=${candidature.id}`
          );
          const offerResponse = await axios.get(
            `http://localhost:8000/offers?id=${candidature.OfferId}`
          );

          return {
            CandidatureInfos: { ...candidature },
            StudentInfos: { ...studentResponse.data },
            InterviewInfos: { ...interviewResponse.data[0] },
            OfferInfos: { ...offerResponse.data[0] },
          };
        })
      );

      console.log("Candidats avec informations:", candidatsWithInfo);

      const countByStatus = candidatsWithInfo.reduce((acc, curr) => {
        acc[curr.CandidatureInfos.candidatureStatus] =
          (acc[curr.CandidatureInfos.candidatureStatus] || 0) + 1;
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

  useEffect(() => {
    getStudentApplicationsForOffer();
  });

  const acceptCandidate = (candidat) => {
    setSelectedCandidature(candidat);
    setIsAcceptModalOpen(true);
  };

  const handleAcceptModalOk = async () => {
    try {
      const updatedCandidature = {
        ...selectedCandidature["CandidatureInfos"],
        candidatureStatus: "entretien technique confirmé",
      };

      await axios.put(
        `http://localhost:8000/Student_Application/${selectedCandidature["CandidatureInfos"].id}`,
        updatedCandidature
      );

      setIsAcceptModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'acceptation du candidat", error);
    }
  };

  const handleAcceptModalCancel = () => {
    setIsAcceptModalOpen(false);
  };

  const refuseCandidate = (candidat) => {
    setSelectedCandidature(candidat);
    setIsRefuseModalOpen(true);
  };

  const handleRefuseModalOk = async () => {
    try {
      await axios.put(
        `http://localhost:8000/Student_Application/${selectedCandidature["CandidatureInfos"].id}`,
        {
          ...selectedCandidature["CandidatureInfos"],
          candidatureStatus: "refusé",
          refuseReason: refuseMessage,
        }
      );
      setIsRefuseModalOpen(false);
    } catch (error) {
      console.error("Erreur lors du refus du candidat", error);
    }
  };

  const handleRefuseModalCancel = () => {
    setIsRefuseModalOpen(false);
  };

  const viewProfile = (candidat) => {
    setSelectedCandidature(candidat);
    setIsProfileModalOpen(true);
  };

  const viewProfileCancel = () => {
    setIsProfileModalOpen(false);
  };

  const viewCandidatureFile = async (candidat) => {
    console.log("cand", candidat);
    setSelectedCandidature(candidat);
    setIsCandidatureFileModalOpen(true);
  };

  const viewCandidatureFileCancel = () => {
    setIsCandidatureFileModalOpen(false);
  };
  const actions = (candidat) => [
    {
      name: "Fiche candidature",
      onClick: () => viewCandidatureFile(candidat),
      disabled: candidat["CandidatureInfos"].candidatureStatus === "en cours",
      Icon: FaRegUser,
    },
    {
      name: "accepter",
      onClick: () => acceptCandidate(candidat),
      disabled:
        candidat["CandidatureInfos"].candidatureStatus !==
        "entretien technique confirmé",
      Icon: BsPersonCheck,
    },
    {
      name: "refuser",
      onClick: () => refuseCandidate(candidat),
      disabled: candidat["CandidatureInfos"].candidatureStatus === "accepté",
      Icon: BsPersonDash,
    },
  ];

  // State pour stocker le pourcentage d'adéquation calculé
  const [pourcentageAdequation, setPourcentageAdequation] = useState(null);

  // Fonction pour calculer le pourcentage d'adéquation
  const calculerPourcentageAdequation = () => {
    let total = 0;
    let totalDemande = 0;

    // Parcourir chaque compétence et calculer le total des notes pour chaque compétence
    Object.entries(selectedCandidature["OfferInfos"].competences).forEach(
      ([competence, niveauDemande]) => {
        const niveauSelectionne = selectedNiveaux[competence] || 0;
        total += parseInt(niveauSelectionne);
        totalDemande += parseInt(SkillsLevel.indexOf(niveauDemande));
      }
    );

    // Calculer le pourcentage d'adéquation
    const moyenne =
      total / Object.keys(selectedCandidature["OfferInfos"].competences).length;
    const moyenneDemande =
      totalDemande /
      Object.keys(selectedCandidature["OfferInfos"].competences).length;
    const pourcentage = (moyenne / moyenneDemande) * 100;
    setPourcentageAdequation(pourcentage);
  };

  return (
    <div className="offres-page">
      <Navbar links={VTNavbarLinks(id)} />
      <h3 className="title-offre">Liste des candidats assignés</h3>
      <FaRegUser className="icon-offre" />
      <Row gutter={[16, 16]}>
        {Object.entries(candidatures).map(([status, count]) => (
          <Col key={status} xs={24} sm={12} md={8} lg={6}>
            <CandidatsCard candidatureStatus={status} nombreCandidats={count} />
          </Col>
        ))}
      </Row>
      {candidats.map((candidat) => (
        <ListeCandidatureCard
          key={candidat["CandidatureInfos"].id}
          Title={`${candidat["StudentInfos"].firstName} ${candidat["StudentInfos"].lastName}`}
          candidatureStatus={candidat["CandidatureInfos"].candidatureStatus}
          candidatureDate={candidat["CandidatureInfos"].candidatureDate}
          actions={actions(candidat)}
          statusRefusePopover={candidat["CandidatureInfos"].refuseReason}
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
        >
          <div>
            <p>
              <strong>Nom et prénom: </strong>{" "}
              {selectedCandidature["StudentInfos"].firstName}{" "}
              {selectedCandidature["StudentInfos"].lastName}
            </p>
            <p>
              <strong>Email: </strong>{" "}
              {selectedCandidature["StudentInfos"].email}
            </p>
            <p>
              <strong>Téléphone: </strong>{" "}
              {selectedCandidature["StudentInfos"].phoneNumber}
            </p>
            <p>
              <strong>Niveau: </strong>{" "}
              {selectedCandidature["StudentInfos"].studyLevel}
            </p>
            <p>
              <strong>Etablissement: </strong>{" "}
              {selectedCandidature["StudentInfos"].establishment}
            </p>
            <p>
              <strong>CV: </strong> {selectedCandidature["StudentInfos"].CV}
            </p>
            <p>
              <strong>Adresse: </strong>{" "}
              {selectedCandidature["StudentInfos"].address}
            </p>
            <label htmlFor="stageDescription">
              <strong>Lettre de recommendation :</strong>
            </label>
            <textarea
              type="text"
              placeholder="Lettre de recommendation"
              className="textarea-design"
              value={selectedCandidature["StudentInfos"].recommendationLetter}
            />
          </div>
        </Modal>
      )}
      {isCandidatureFileModalOpen && (
        <Modal
          title="Fiche de candidature"
          visible={isCandidatureFileModalOpen}
          onOk={viewCandidatureFileCancel}
          onCancel={viewCandidatureFileCancel}
          okText="Fermer"
        >
          <div>
            <p>
              <strong>Nom et prénom du candidat: </strong>{" "}
              {selectedCandidature["StudentInfos"].firstName}{" "}
              {selectedCandidature["StudentInfos"].lastName}
            </p>
            <p>
              <strong>Titre de stage:</strong>{" "}
              {selectedCandidature["OfferInfos"].stageTitle}
            </p>
            <p>
              <strong>Date de candidature:</strong>{" "}
              {selectedCandidature["CandidatureInfos"].candidatureDate}
            </p>
            <p>
              <strong>Statut de candidature:</strong>{" "}
              {selectedCandidature["CandidatureInfos"].candidatureStatus}
            </p>
            <p>
              <strong>Date de l'entretien:</strong>{" "}
              {selectedCandidature["InterviewInfos"].date}
            </p>
            <p>
              <strong>Heure de l'entretien:</strong>{" "}
              {selectedCandidature["InterviewInfos"].heure}
            </p>
            <div>
              {Object.entries(
                selectedCandidature["OfferInfos"].competences
              ).map(([competence, niveau]) => (
                <div key={competence} className="competence-container">
                  <p>
                    <strong>
                      {competence} (Niveau demandé: {niveau}):
                    </strong>{" "}
                    {SkillsLevel[selectedNiveaux[competence]]}
                  </p>
                </div>
              ))}
            </div>
            {pourcentageAdequation !== null && (
              <p>
                Pourcentage d'adéquation: {pourcentageAdequation.toFixed(2)}%
              </p>
            )}
            <button onClick={calculerPourcentageAdequation}>
              Pourcentage d'adéquation
            </button>
          </div>
        </Modal>
      )}
      {/* Modal pour accepter un candidat */}
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
      {/* Modal pour refuser un candidat */}
      {isRefuseModalOpen && (
        <Modal
          title="Refuser le candidat"
          visible={isRefuseModalOpen}
          onOk={handleRefuseModalOk}
          onCancel={handleRefuseModalCancel}
          okText="Refuser"
          cancelText="Annuler"
        >
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
        </Modal>
      )}
    </div>
  );
};

export default ListeCandidaturesVT;
