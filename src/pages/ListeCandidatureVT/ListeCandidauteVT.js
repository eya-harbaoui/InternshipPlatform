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
import { competenceLevelsMapping } from "../../components/OffresCard/SkillsLevel";
import { refuseReasons } from "../../components/CandidatureCard/refuseReasons";
import CompetenceDetails from "../../components/CandidatureCard/CompetenceDetails";
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
  const [acquiredLevels, setAcquiredLevels] = useState({});
  const [adequacyPercentage, setAdequacyPercentage] = useState(0);
  const [competencesCandidat, setCompetencesCandidat] = useState([]);
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
  const endInterviewFunc = async () => {
    setIsCandidatureFileModalOpen(false);
    try {
      const updatedCandidatureData = {
        ...selectedCandidature["CandidatureInfos"],
        competencesCandidat: competencesCandidat,
        adequacyPercentage: adequacyPercentage,
        technicallyEvaluated: true,
      };

      // Effectuez la requête PUT vers le backend pour mettre à jour la candidature
      await axios.put(
        `http://localhost:8000/Student_Application/${selectedCandidature["CandidatureInfos"].id}`,
        updatedCandidatureData
      );

      // Fermez le modal après avoir terminé la mise à jour
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la candidature :", error);
    }
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
      disabled: candidat["CandidatureInfos"].candidatureStatus === "refusé",
      Icon: BsPersonCheck,
    },
    {
      name: "refuser",
      onClick: () => refuseCandidate(candidat),
      disabled: candidat["CandidatureInfos"].candidatureStatus === "accepté",
      Icon: BsPersonDash,
    },
  ];
  const handleLevelChange = (competence, value) => {
    setAcquiredLevels((prevState) => ({
      ...prevState,
      [competence]: value,
    }));
  };
  // Ajoutez un état local pour stocker les pourcentages d'adéquation pour chaque compétence
  const [competenceAdequacyPercentages, setCompetenceAdequacyPercentages] =
    useState({});

  // Modifiez la fonction calculateAdequacyPercentage pour calculer les pourcentages d'adéquation pour chaque compétence
  const calculateAdequacyPercentage = () => {
    const competencePercentages = {};
    const newCompetencesCandidat = [];

    Object.entries(selectedCandidature["OfferInfos"].competences).forEach(
      ([competence, niveau]) => {
        if (acquiredLevels[competence]) {
          const acquiredLevel =
            competenceLevelsMapping[acquiredLevels[competence]];
          const demandedLevel = competenceLevelsMapping[niveau];

          if (!isNaN(acquiredLevel) && !isNaN(demandedLevel)) {
            const percentage = ((acquiredLevel / demandedLevel) * 100).toFixed(
              2
            );
            newCompetencesCandidat.push({
              nom: competence,
              niveauDemande: niveau,
              niveauAcquis: acquiredLevels[competence],
              pourcentageAdequation: percentage,
            });
            competencePercentages[competence] = percentage;
          }
        }
      }
    );

    setCompetenceAdequacyPercentages(competencePercentages);

    let total = 0;
    let count = 0;

    Object.values(competencePercentages).forEach((percentage) => {
      total += parseFloat(percentage);
      count++;
    });

    const average = count > 0 ? total / count : 0;
    const globalPercentage = average.toFixed(2);
    const globalPercentageNumber = parseFloat(globalPercentage);
    setAdequacyPercentage(
      isNaN(globalPercentageNumber) ? 0 : globalPercentageNumber
    );
    setCompetencesCandidat(newCompetencesCandidat);
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
          onOk={endInterviewFunc}
          onCancel={viewCandidatureFileCancel}
          okText="Sauvegarder"
          cancelText="Annuler"
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
            {!selectedCandidature["CandidatureInfos"].technicallyEvaluated && (
              <div>
                <h3>Liste des compétences : </h3>
                {Object.entries(
                  selectedCandidature["OfferInfos"].competences
                ).map(([competence, niveau]) => (
                  <div key={competence} className="competence-container">
                    <p>
                      <strong>{competence}</strong>
                    </p>
                    <p>Niveau demandé: {niveau}</p>
                    <p>
                      Niveau acquis:
                      <Select
                        defaultValue="aucune compétence"
                        style={{ width: 200 }}
                        onChange={(value) =>
                          handleLevelChange(competence, value)
                        }
                      >
                        <Option value="aucune compétence">
                          Aucune compétence
                        </Option>
                        <Option value="connaissance théorique">
                          Connaissance théorique
                        </Option>
                        <Option value="connaissance pratique">
                          Connaissance pratique
                        </Option>
                        <Option value="débutant">Débutant</Option>
                        <Option value="intermédiaire">Intermédiaire</Option>
                        <Option value="maîtrise">Maîtrise</Option>
                      </Select>
                    </p>
                    <p>
                      Pourcentage d'adéquation :{" "}
                      {competenceAdequacyPercentages[competence] || "N/A"}%
                    </p>
                  </div>
                ))}
                <button
                  onClick={() => {
                    calculateAdequacyPercentage();
                  }}
                >
                  Calculer pourcentage d'adéquation
                </button>
                <p>
                  Pourcentage d'adéquation globale:{" "}
                  {adequacyPercentage && adequacyPercentage.toFixed(2)}%
                </p>
              </div>
            )}
            {selectedCandidature["CandidatureInfos"].technicallyEvaluated && (
              <div>
                <CompetenceDetails
                  candidatureId={selectedCandidature["CandidatureInfos"].id}
                ></CompetenceDetails>
              </div>
            )}
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
