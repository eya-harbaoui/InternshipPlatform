import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaArchive } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import "./OffresCard.css";
import { Tag, Modal, Select } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StageCard from "./StageCard";
import {
  durationOptions,
  modeOptions,
  natureOptions,
} from "../../components/Filter/FilterOptions.js";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const { Option } = Select;

const OffresRHCard = ({
  id,
  offerLink,
  stageTitle,
  stageNature,
  stageDescription,
  domainTag,
  modeTag,
  durationTag,
  OfferStatus,
  competences,
  publicationDate,
}) => {
  //Define the states and functions
  const [domainOptions, setDomainOptions] = useState([]);
  const [domains, setDomains] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState({
    id: id,
    stageTitle: stageTitle,
    stageNature: stageNature,
    modeTag: modeTag,
    domainTag: domainTag,
    durationTag: durationTag,
    stageDescription: stageDescription,
    competences: competences,
    OfferStatus: OfferStatus,
    publicationDate: publicationDate,
    offerLink: offerLink,
  });
  const [domaineSelectionne, setDomaineSelectionne] = useState(
    selectedOffer.domainTag
  );
  const [competencesDomaine, setCompetencesDomaine] = useState(
    selectedOffer.competences
  );
  const [changeCompetences, setChangeCompetences] = useState(false);
  const fetchDomains = async () => {
    try {
      const response = await axios.get("http://localhost:8000/Domaines");
      if (response.data) {
        setDomains(response.data);
        const domains = response.data.map((domain) => ({
          value: domain.domainName,
          label: domain.domainName,
        }));
        setDomainOptions([
          { value: "", label: "Tous les domaines" },
          ...domains,
        ]);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations de profil :",
        error
      );
    }
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCandidatures = () => {
    console.log("shiw candidatures");
  };

  const handleCancel = () => {
    setSelectedOffer({
      id: id,
      stageTitle: stageTitle,
      stageNature: stageNature,
      modeTag: modeTag,
      domainTag: domainTag,
      durationTag: durationTag,
      stageDescription: stageDescription,
      competences: competences,
      OfferStatus: OfferStatus,
      publicationDate: publicationDate,
      offerLink: offerLink,
    });
    setIsModalOpen(false);
    setChangeCompetences(false);
  };
  const navigate = useNavigate();
  let tagColor = "";
  let tagText = "";
  switch (OfferStatus) {
    case "en cours de validation":
      tagColor = "blue";
      tagText = "en cours de validation";
      break;
    case "publié":
      tagColor = "green";
      tagText = "publié";
      break;
    case "brouillon":
      tagColor = "red";
      tagText = "brouillon";
      break;
    case "archivé":
      tagColor = "purple";
      tagText = "Archivé";
      break;
    default:
      tagColor = "default";
      tagText = "Statut inconnu";
  }

  const handlePublishClick = async () => {
    try {
      // Implement your publish logic here
      await axios.put(`http://localhost:8000/offers/${selectedOffer.id}`, {
        ...selectedOffer,
        OfferStatus: "en cours de validation",
      });
      toast.success("Offre en cours de validation");
    } catch (error) {
      console.error("Erreur lors de la publication de l'offre :", error);
    }
  };

  const handleEditClick = async () => {
    try {
      console.log(selectedOffer, "selectedOffer puuuuut");
      await axios.put(
        `http://localhost:8000/offers/${selectedOffer.id}`,
        selectedOffer
      );
      setChangeCompetences(false);
      setIsModalOpen(false);
      toast.success("Offre modifiée");
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi des informations de profil :",
        error
      );
    }
  };

  const handleDeleteClick = async () => {
    try {
      await axios.delete(`http://localhost:8000/offers/${selectedOffer.id}`);
      toast.success("Offre supprimée");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'offre :", error);
    }
  };

  const handleArchiveClick = async () => {
    try {
      await axios.put(`http://localhost:8000/offers/${selectedOffer.id}`, {
        ...selectedOffer,
        OfferStatus: "archivé",
      });
      toast.success("Offre archivée avec succès");
    } catch (error) {
      console.error("Erreur lors de l'archivage de l'offre :", error);
    }
  };

  const handleDomaineChange = (domaine) => {
    setDomaineSelectionne(domaine);
    setSelectedOffer({
      ...selectedOffer,
      domainTag: domaine,
      competences: {},
    });
    setChangeCompetences(true);
    const competences =
      domains.find((d) => d.domainName === domaine)?.competences || [];
    setCompetencesDomaine({ ...competencesDomaine, [domaine]: competences });
  };
  const handleCompetenceChange = (competence, niveau) => {
    const updatedCompetences = {
      ...selectedOffer.competences,
      [competence]: niveau,
    };
    setSelectedOffer({ ...selectedOffer, competences: updatedCompetences });
  };

  useEffect(() => {
    fetchDomains();
  }, []);
  return (
    <>
      <div className="stage-card">
        <StageCard
          student={false}
          stageTitle={stageTitle}
          stageNature={stageNature}
          stageDescription={stageDescription}
          modeTag={modeTag}
          domainTag={domainTag}
          durationTag={durationTag}
          buttonName={"publier"}
          handleButtonFunction={handlePublishClick}
          OfferStatus={OfferStatus}
        />
        <div className="actions">
          <span
            className="action"
            onClick={showModal}
            disabled={OfferStatus === "publié"}
            style={{
              pointerEvents: OfferStatus === "publié" ? "none" : "auto",
              opacity: OfferStatus === "publié" ? 0.5 : 1,
            }}
          >
            <FaEdit className="action-icon" />
            Modifier
          </span>
          <span
            className="action"
            onClick={handleDeleteClick}
            disabled={OfferStatus === "publié"}
            style={{
              pointerEvents: OfferStatus === "publié" ? "none" : "auto",
              opacity: OfferStatus === "publié" ? 0.5 : 1,
            }}
          >
            <FaTrash className="action-icon" />
            Supprimer
          </span>
          <span className="action" onClick={handleArchiveClick}>
            <FaArchive className="action-icon" />
            Archiver
          </span>
          <span className="action" onClick={handleCandidatures}>
            <FaUserGroup className="action-icon" />
            Candidatures
          </span>
        </div>

        <Tag color={tagColor} className="status-tag">
          {tagText}
        </Tag>

        {isModalOpen && (
          <Modal
            title="Modifier l'offre"
            visible={isModalOpen}
            onOk={handleEditClick}
            onCancel={handleCancel}
            okText="Modifier cette offre"
            cancelText="Annuler la modification"
          >
            <div className="modal-content">
              <h3>Modifier les informations de l'offre</h3>
              <input
                type="text"
                placeholder="Titre de stage"
                className="input-text-design"
                value={selectedOffer.stageTitle}
                onChange={(e) =>
                  setSelectedOffer({
                    ...selectedOffer,
                    stageTitle: e.target.value,
                  })
                }
              />
              <textarea
                type="text"
                placeholder="description de stage"
                className="textarea-design"
                value={selectedOffer.stageDescription}
                onChange={(e) =>
                  setSelectedOffer({
                    ...selectedOffer,
                    stageDescription: e.target.value,
                  })
                }
              />
              <Select
                placeholder="Domaine de stage"
                className="modal-input"
                style={{ width: "100%" }}
                value={domaineSelectionne}
                onChange={handleDomaineChange}
              >
                {domainOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
              <Select
                placeholder="Mode de stage"
                className="modal-input"
                style={{ width: "100%" }}
                value={selectedOffer.modeTag}
                onChange={(value) => {
                  setSelectedOffer({ ...selectedOffer, modeTag: value });
                }}
              >
                {modeOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
              <Select
                placeholder="Durée de stage"
                className="modal-input"
                style={{ width: "100%" }}
                value={selectedOffer.durationTag}
                onChange={(value) =>
                  setSelectedOffer({ ...selectedOffer, durationTag: value })
                }
              >
                {durationOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
              <Select
                placeholder="Nature de stage"
                className="modal-input"
                style={{ width: "100%" }}
                value={selectedOffer.stageNature}
                onChange={(value) =>
                  setSelectedOffer({ ...selectedOffer, stageNature: value })
                }
              >
                {natureOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
              <div className="competences-container">
                <h3>Compétences demandées :</h3>
                {!changeCompetences &&
                  selectedOffer.competences &&
                  Object.entries(selectedOffer.competences).map(
                    ([competence, niveau]) => (
                      <p key={competence}>
                        {competence}: {niveau}
                      </p>
                    )
                  )}
                {changeCompetences &&
                  competencesDomaine[domaineSelectionne]?.map((competence) => (
                    <div key={competence} className="competence-input">
                      <span>{competence}</span>
                      <Select
                        className="modal-input"
                        onChange={(value) =>
                          handleCompetenceChange(competence, value)
                        }
                      >
                        <Option value="Débutant">Débutant</Option>
                        <Option value="Intermédiaire">Intermédiaire</Option>
                        <Option value="Avancé">Avancé</Option>
                      </Select>
                    </div>
                  ))}
              </div>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default OffresRHCard;
