import React, { useState } from "react";
import {
  FaRegLightbulb,
  FaRegCalendarAlt,
  FaEdit,
  FaTrash,
  FaArchive,
} from "react-icons/fa";
import { FiHome } from "react-icons/fi";
import "./OffresRHCard.css";
import { Tag, Modal, Select } from "antd";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const competenceOptions = [
  { value: "HTML", label: "HTML" },
  { value: "CSS", label: "CSS" },
  { value: "JavaScript", label: "JavaScript" },
];
const OffresRHCard = ({
  stageTitle,
  stageNature,
  stageDescription,
  domainTag,
  modeTag,
  durationTag,
  offerLink,
  competences,
  OfferStatus,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
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

  const domainOptions = [
    { value: "web", label: "Web" },
    { value: "mobile", label: "Mobile" },
    { value: "data", label: "Data" },
  ];

  const [selectedOffer, setSelectedOffer] = useState({
    title: "",
    domain: "",
    competences: [],
    niveauCompetence: [],
  });

  const handleOfferChange = (key, value) => {
    setSelectedOffer({ ...selectedOffer, [key]: value });
  };

  const handleCompetenceChange = (competence, niveau) => {
    setSelectedOffer({
      ...selectedOffer,
      competences: [...selectedOffer.competences, competence],
      niveauCompetence: [...selectedOffer.niveauCompetence, niveau],
    });
  };

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

  return (
    <div className="Offer-RH-card">
      <div className="title-and-publish">
        <h2>{stageTitle}</h2>
        <button className="small-button" onClick={handlePublishClick}>
          Publier
        </button>
      </div>
      <div className="content">
        <p>{stageNature}</p>
        <p>{stageDescription}</p>
        <div className="tags">
          <div className="tag">
            <FaRegLightbulb /> {domainTag}
          </div>
          <div className="tag">
            <FiHome /> {modeTag}
          </div>
          <div className="tag">
            <FaRegCalendarAlt /> {durationTag}
          </div>
        </div>
      </div>
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
              className="modal-input"
              value={selectedOffer.title}
              onChange={(e) => handleOfferChange("title", e.target.value)}
            />
            <Select
              placeholder="Domaine de stage"
              className="modal-input"
              style={{ width: "100%" }}
              value={selectedOffer.domain}
              onChange={(value) => handleOfferChange("domain", value)}
            >
              {domainOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
            {/* Other Select components for nature, mode, duration */}
            <div className="competences-container">
              <h3>Compétences demandées :</h3>
              {selectedOffer.competences.map((competence, index) => (
                <div key={index} className="competence-input">
                  <span>{competence}</span>
                  <Select
                    defaultValue={selectedOffer.niveauCompetence[index]}
                    onChange={(value) =>
                      handleCompetenceLevelChange(index, value)
                    }
                  >
                    <Option value="Débutant">Débutant</Option>
                    <Option value="Intermédiaire">Intermédiaire</Option>
                    <Option value="Avancé">Avancé</Option>
                  </Select>
                </div>
              ))}
              <Select
                placeholder="Ajouter une compétence"
                style={{ width: "100%" }}
                onChange={(value) => handleCompetenceChange(value, "Débutant")}
              >
                {competenceOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OffresRHCard;
