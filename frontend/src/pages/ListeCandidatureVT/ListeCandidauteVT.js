import React, { useState, useEffect } from "react";
import { Select, Row, Col, Modal, Input, Button, Radio } from "antd";
import { FaRegUser } from "react-icons/fa";
import { BsPersonCheck, BsPersonDash } from "react-icons/bs";
import { FaDownload } from "react-icons/fa";
import CandidatsCard from "../../components/CandidatsCard/CandidatsCard";
import ListeCandidatureCard from "../../components/CandidatureCard/ListeCandidatureCard";
import { VTNavbarLinks } from "../../components/Navbar/VTNavbarLinks";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import { skillLevelsMapping } from "../../components/OffresCard/SkillsLevel";
import { refuseReasons } from "../../components/CandidatureCard/refuseReasons";
import CompetenceDetails from "../../components/CandidatureCard/CompetenceDetails";
import getUserIdFromLocalStorage from "../../UserAuth.js";
import fileDownload from "js-file-download";
import { toast } from "react-toastify";

const ListeCandidaturesVT = () => {
  const { role, userId } = getUserIdFromLocalStorage() || {};

  const { Option } = Select;
  const [candidatures, setCandidatures] = useState({});
  const [candidats, setCandidats] = useState([]);
  const [selectedCandidature, setSelectedCandidature] = useState(null);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCandidatureFileModalOpen, setIsCandidatureFileModalOpen] =
    useState(false);
  const [isFicheModelOpen, setIsFicheModelOpen] = useState(false);

  const [isRefuseModalOpen, setIsRefuseModalOpen] = useState(false);
  const [acceptMessage, setAcceptMessage] = useState("");
  const [refuseMessage, setRefuseMessage] = useState("");
  const [acquiredLevels, setAcquiredLevels] = useState({});
  const [adequacyPercentage, setAdequacyPercentage] = useState(0);
  const [skillsCandidat, setskillsCandidat] = useState([]);
  const [refuseOption, setRefuseOption] = useState("");

  const getStudentApplicationsForOffer = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/application/candidatures_by_interviewer/${userId}`
      );

      const candidatsWithInfo = response.data;

      //console.log("Candidats avec informations:", candidatsWithInfo);

      const countByStatus = candidatsWithInfo.reduce((acc, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
      }, {});

      //console.log("Nombre de candidatures par statut:", countByStatus);

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
    //console.log(skillsCandidat, "skills Candidat");
  });

  const acceptCandidate = (candidat) => {
    setSelectedCandidature(candidat);
    setIsAcceptModalOpen(true);
  };

  const handleAcceptModalOk = async () => {
    try {
      const updatedCandidature = {
        ...selectedCandidature,
        status: "entretien technique confirmé",
        validationComment: acceptMessage,
      };

      await axios.put(
        `http://localhost:8000/application/update_candidature/${selectedCandidature._id}`,
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
        `http://localhost:8000/application/update_candidature/${selectedCandidature._id}`,
        {
          ...selectedCandidature,
          status: "refusé",
          rejectionReason: refuseMessage,
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

  const handleFicheModelClose = () => {
    setIsFicheModelOpen(false);
  };

  const viewCandidatureFile = async (candidat) => {
    //console.log("cand", candidat);
    setSelectedCandidature(candidat);
    setIsCandidatureFileModalOpen(true);
    setIsFicheModelOpen(true);
  };
  const endInterviewFunc = async () => {
    setIsCandidatureFileModalOpen(false);
    try {
      const updatedCandidatureData = {
        applicantSkills: skillsCandidat,
        adequacyPercentage: adequacyPercentage,
        technicallyEvaluated: true,
      };

      // Effectuez la requête PUT vers le backend pour mettre à jour la candidature
      await axios.put(
        `http://localhost:8000/application/update_candidature/${selectedCandidature._id}`,
        updatedCandidatureData
      );

      // Fermez le modal après avoir terminé la mise à jour
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la candidature :", error);
    }
  };
  const viewCandidatureFileCancel = () => {
    setIsCandidatureFileModalOpen(false);
    setskillAdequacyPercentages({});
    setAdequacyPercentage(0);
    setAcquiredLevels({});
  };

  const downloadCV = async (candidat) => {
    if (!candidat.applicant?.cv) {
      console.error("No CV available for this candidate");
      return;
    }

    try {
      const response = await axios({
        url: `http://localhost:8000/download/cv/${candidat.applicant?.cv}`,
        method: "GET",
        responseType: "blob",
      });

      fileDownload(
        response.data,
        `${candidat.applicant.firstName}_${candidat.applicant.lastName}_CV.pdf`
      );
    } catch (error) {
      console.error("Error downloading CV:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      toast.error("Le fichier n'a pas pu être téléchargé");
    }
  };

  const actions = (candidat) => [
    {
      name: "Télécharger CV",
      onClick: () => downloadCV(candidat),
      disabled: !candidat.applicant?.cv,
      Icon: FaDownload,
    },
    {
      name: "Fiche candidature",
      onClick: () => viewCandidatureFile(candidat),
      disabled: candidat.status === "en cours",
      Icon: FaRegUser,
    },

    {
      name: "accepter",
      onClick: () => acceptCandidate(candidat),
      disabled:
        candidat.status === "refusé" ||
        candidat.technicallyEvaluated === false ||
        candidat.status === "entretien technique confirmé",
      Icon: BsPersonCheck,
    },
    {
      name: "refuser",
      onClick: () => refuseCandidate(candidat),
      disabled:
        candidat.status === "accepté" ||
        candidat.technicallyEvaluated === false ||
        candidat.status === "entretien RH programmé" ||
        candidat.status === "entretien technique confirmé",
      Icon: BsPersonDash,
    },
  ];
  const handleLevelChange = (skill, value) => {
    setAcquiredLevels((prevState) => ({
      ...prevState,
      [skill]: value,
    }));
    //console.log(acquiredLevels, "acuiredlevels");
  };
  // Ajoutez un état local pour stocker les pourcentages d'adéquation pour chaque compétence
  const [skillAdequacyPercentages, setskillAdequacyPercentages] = useState({});

  // la fonction calculateAdequacyPercentage pour calculer les pourcentages d'adéquation pour chaque compétence

  const calculateAdequacyPercentage = () => {
    if (!selectedCandidature || !selectedCandidature.offer) return;

    const skillPercentages = {};
    const newskillsCandidat = [];

    selectedCandidature.offer.skills.map((skillItem) => {
      if (acquiredLevels[skillItem.skill._id]) {
        const acquiredLevel =
          skillLevelsMapping[acquiredLevels[skillItem.skill._id]];
        const demandedLevel = skillLevelsMapping[skillItem.level];

        if (!isNaN(acquiredLevel) && !isNaN(demandedLevel)) {
          const percentage = ((acquiredLevel / demandedLevel) * 100).toFixed(2);
          newskillsCandidat.push({
            skill: skillItem.skill._id,
            levelRequired: skillItem.level,
            levelAcquired: acquiredLevels[skillItem.skill._id],
            adequacyPercentage: percentage,
          });
          skillPercentages[skillItem.skill._id] = percentage;
        }
      }
    });

    setskillAdequacyPercentages(skillPercentages);

    let total = 0;
    let count = 0;

    Object.values(skillPercentages).forEach((percentage) => {
      total += parseFloat(percentage);
      count++;
    });

    const average = count > 0 ? total / count : 0;
    const globalPercentage = average.toFixed(2);
    const globalPercentageNumber = parseFloat(globalPercentage);
    setAdequacyPercentage(
      isNaN(globalPercentageNumber) ? 0 : globalPercentageNumber
    );
    setskillsCandidat(newskillsCandidat);
    //console.log(skillsCandidat, "skills Candidat");
  };

  return (
    <div className="offres-page">
      <Navbar links={VTNavbarLinks(userId)} />
      <h3 className="title-offre">Liste des candidats assignés</h3>
      <FaRegUser className="icon-offre" />
      <Row gutter={[16, 16]}>
        {Object.entries(candidatures).length > 0 ? (
          Object.entries(candidatures).map(([status, count]) => (
            <Col key={status} xs={24} sm={12} md={8} lg={6}>
              <CandidatsCard status={status} nombreCandidats={count} />
            </Col>
          ))
        ) : (
          <Col xs={24}>
            <p>Aucune candidature disponible.</p>
          </Col>
        )}
      </Row>
      {candidats.length > 0 ? (
        candidats.map((candidat) => (
          <ListeCandidatureCard
            key={candidat._id}
            title={`${candidat.applicant?.firstName} ${candidat.applicant?.lastName}`}
            status={candidat.status}
            createdAt={candidat.createdAt}
            actions={actions(candidat)}
            statusRefusePopover={candidat.refuseReason}
            onClickTitle={() => {
              viewProfile(candidat);
            }}
          />
        ))
      ) : (
        <p>Aucun candidat disponible.</p>
      )}

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
          {selectedCandidature && selectedCandidature.applicant ? (
            <div>
              <p>
                <strong>Nom et prénom du candidat: </strong>
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
                <strong>level: </strong>{" "}
                {selectedCandidature.applicant.studyLevel}
              </p>
              <p>
                <strong>Etablissement: </strong>{" "}
                {selectedCandidature.applicant.establishment}
              </p>
              <p>
                <strong>CV: </strong> {selectedCandidature.applicant?.cv}
              </p>
              <p>
                <strong>Adresse: </strong>{" "}
                {selectedCandidature.applicant.address}
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
          ) : (
            <div>Aucun candidat</div>
          )}
        </Modal>
      )}
      {isCandidatureFileModalOpen &&
        selectedCandidature.technicallyEvaluated === false && (
          <Modal
            title="Fiche de candidature"
            visible={isCandidatureFileModalOpen}
            onOk={endInterviewFunc}
            onCancel={viewCandidatureFileCancel}
            okText="Sauvegarder et confirmer l'entretien"
            cancelText="Annuler"
          >
            {selectedCandidature && selectedCandidature.applicant ? (
              <div>
                <p>
                  <strong>Nom et prénom du candidat :</strong>{" "}
                  {selectedCandidature.applicant.firstName}{" "}
                  {selectedCandidature.applicant.lastName}
                </p>
                <p>
                  <strong>Titre du stage :</strong>{" "}
                  {selectedCandidature.offer.title}
                </p>
                <p>
                  <strong>Date de candidature :</strong>{" "}
                  {selectedCandidature.createdAt}
                </p>
                <p>
                  <strong>Statut de la candidature :</strong>{" "}
                  {selectedCandidature.status}
                </p>
                <p>
                  <strong>Date et heure de l'entretien :</strong>{" "}
                  {selectedCandidature.interviewDateTime}
                </p>

                <div>
                  <h4>Liste des compétences :</h4>
                  {selectedCandidature.offer.skills.map((skillItem) => (
                    <div key={skillItem.skill._id} className="skill-container">
                      <p>
                        <strong>{skillItem.skill.name}</strong>
                      </p>
                      <p>Niveau demandé : {skillItem.level}</p>
                      <p>
                        Niveau acquis :
                        <Select
                          style={{ width: 200 }}
                          placeholder="Évaluez le candidat"
                          onChange={(value) =>
                            handleLevelChange(skillItem.skill._id, value)
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
                        {skillAdequacyPercentages[skillItem.skill._id] || 0}%
                      </p>
                    </div>
                  ))}
                  <Button
                    onClick={() => {
                      calculateAdequacyPercentage();
                    }}
                  >
                    Calculer le pourcentage d'adéquation
                  </Button>
                  <p>
                    Pourcentage d'adéquation global :{" "}
                    {adequacyPercentage && adequacyPercentage.toFixed(2)}%
                  </p>
                </div>
              </div>
            ) : (
              <div>Aucun candidat</div>
            )}
          </Modal>
        )}

      {isFicheModelOpen &&
        selectedCandidature.technicallyEvaluated === true && (
          <Modal
            title="Fiche de candidature"
            visible={isFicheModelOpen}
            onOk={handleFicheModelClose}
            okText={"Fermer"}
            cancelButtonProps={{ style: { display: "none" } }}
          >
            <div>
              {selectedCandidature && selectedCandidature.applicant ? (
                <>
                  <p>
                    <strong>Nom et prénom du candidat : </strong>{" "}
                    {selectedCandidature.applicant.firstName}{" "}
                    {selectedCandidature.applicant.lastName}
                  </p>
                  <p>
                    <strong>Titre de stage : </strong>{" "}
                    {selectedCandidature.offer.title}
                  </p>
                  <p>
                    <strong>Date de candidature : </strong>{" "}
                    {selectedCandidature.createdAt}
                  </p>
                  <p>
                    <strong>Statut de candidature : </strong>{" "}
                    {selectedCandidature.status}
                  </p>
                  <p>
                    <strong>Date et heure de l'entretien : </strong>{" "}
                    {selectedCandidature.interviewDateTime}
                  </p>
                  <div>
                    <CompetenceDetails
                      candidatureId={selectedCandidature._id}
                    />
                  </div>
                </>
              ) : (
                <div>Aucun candidat</div>
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
    </div>
  );
};

export default ListeCandidaturesVT;
