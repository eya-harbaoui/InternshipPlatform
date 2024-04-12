import React, { useState } from "react";
import {
  FaRegLightbulb,
  FaRegCalendarAlt,
  FaEdit,
  FaTrash,
  FaArchive,
} from "react-icons/fa";
import { FiHome } from "react-icons/fi";
import "./OffresCard.css";
import { Tag, Modal, Select } from "antd";
import { useNavigate } from "react-router-dom";
import StageCard from "./StageCard";

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

  const [selectedOffer, setSelectedOffer] = useState({
    title: stageTitle,
    nature: stageNature,
    mode: modeTag,
    domain: domainTag,
    stageDescription: stageDescription,
    // Initialise les niveaux à "Débutant" pour chaque compétence
  });

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
  const domainOptions = [
    { value: "Développement web", label: "Développement web" },
    // Add more domain options here
  ];

  const modeOptions = [
    { value: "Hybride", label: "Hybride" },
    { value: "Remote", label: "Remote" },
    { value: "Présentiel", label: "Présentiel" },
  ];

  const natureOptions = [
    { value: "PFE", label: "PFE" },
    { value: "PFA", label: "PFA" },
    { value: "Initiation", label: "Initiation" },
  ];
  return (
    <div className="stage-card">
      <StageCard
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
              value={selectedOffer.title}
            />
            <textarea
              type="text"
              placeholder="description de stage"
              className="textarea-design"
              value={selectedOffer.stageDescription}
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
            <Select
              placeholder="Mode de stage"
              className="modal-input"
              style={{ width: "100%" }}
              value={selectedOffer.mode}
              onChange={(value) => handleOfferChange("mode", value)}
            >
              {modeOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="Nature de stage"
              className="modal-input"
              style={{ width: "100%" }}
              value={selectedOffer.nature}
              onChange={(value) => handleOfferChange("nature", value)}
            >
              {natureOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OffresRHCard;
