//import
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaArchive } from "react-icons/fa";
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
const { Option } = Select;

const OffresRHCard = ({
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
    stageTitle: stageTitle,
    stageNature: stageNature,
    modeTag: modeTag,
    domainTag: domainTag,
    durationTag: durationTag,
    stageDescription: stageDescription,
    competences: competences,
    // Initialise les niveaux à "Débutant" pour chaque compétence
  });
  const fetchDomains = async () => {
    try {
      const response = await axios.get("http://localhost:8000/Domaines");
      if (response.data) {
        console.log("responseeee", response.data);
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

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [domaineSelectionne, setDomaineSelectionne] = useState("");
  const [competencesDomaine, setCompetencesDomaine] = useState({});

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

  const handleCompetenceLevelChange = (index, niveau) => {
    const newNiveauCompetence = [...selectedOffer.niveauCompetence];
    newNiveauCompetence[index] = niveau;
    setSelectedOffer({
      ...selectedOffer,
      niveauCompetence: newNiveauCompetence,
    });
  };

  const handlePublishClick = () => {
    // Implement your publish logic here
    console.log("Publish clicked");
  };

  const handleEditClick = () => {
    // Implement your edit logic here
    console.log("Edit clicked");
  };

  const handleDeleteClick = () => {
    // Implement your delete logic here
    console.log("Delete clicked");
  };

  const handleArchiveClick = () => {
    // Implement your archive logic here
    console.log("Archive clicked");
  };
  const handleDomaineChange = (domaine) => {
    setDomaineSelectionne(domaine);
    setSelectedOffer({ ...selectedOffer, domainTag: domaine });
    const competences =
      domains.find((d) => d.domainName === domaine)?.competencesList || [];
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
      />
      <div className="actions">
        <span className="action" onClick={showModal}>
          <FaEdit className="action-icon" />
          Modifier
        </span>
        <span className="action" onClick={handleDeleteClick}>
          <FaTrash className="action-icon" />
          Supprimer
        </span>
        <span className="action" onClick={handleArchiveClick}>
          <FaArchive className="action-icon" />
          Archiver
        </span>
      </div>

      <Tag color={tagColor} className="status-tag">
        {tagText}
      </Tag>

      {isModalOpen && (
        <Modal
          title="Modifier l'offre"
          visible={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
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
              value={selectedOffer.domainTag}
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
              onChange={(e) => {
                setSelectedOffer({ ...selectedOffer, modeTag: e.target.value });
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
              {competencesDomaine[domaineSelectionne]?.map((competence) => (
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
  );
};

export default OffresRHCard;
