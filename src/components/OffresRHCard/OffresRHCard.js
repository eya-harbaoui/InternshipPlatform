// OffresRHCard.js
import React from "react";

import {
  FaRegLightbulb,
  FaRegCalendarAlt,
  FaEdit,
  FaTrash,
  FaArchive,
} from "react-icons/fa";
import { FiHome } from "react-icons/fi";
import "./OffresRHCard.css";
import { Tag } from "antd";
import { useNavigate } from "react-router-dom";

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

   

  const handlePublishClick = () => {
    // Action à effectuer lorsque le bouton "Publier" est cliqué
    console.log("Publish clicked");
  };

  const handleEditClick = () => {
    // Action à effectuer lorsque le bouton "Modifier" est cliqué
    console.log("Edit clicked");
  };

  const handleDeleteClick = () => {
    // Action à effectuer lorsque le bouton "Supprimer" est cliqué
    console.log("Delete clicked");
  };

  const handleArchiveClick = () => {
    // Action à effectuer lorsque le bouton "Archiver" est cliqué
    console.log("Archive clicked");
  };

  return (
    <div className="Offer-RH-card">
      <div className="title-and-publish">
        <h2>{stageTitle}</h2>
        <button className="small-button">
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
        <span className="action" onClick={handleEditClick}>
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
      
    </div>
  );
};

export default OffresRHCard;
