// CandidatureCard.js
import React from "react";
import { Tag } from "antd";
import "./CandidatureCard.css";

const CandidatureCard = ({
  stageTitle,
  candidatureDate,
  candidatureStatus,
}) => {
  let tagColor = "";
  let tagText = "";

  switch (candidatureStatus) {
    case "en cours":
      tagColor = "blue";
      tagText = "En cours";
      break;
    case "entretien tehcique/RH programmé":
      tagColor = "green";
      tagText = "Entretien programmé";
      break;
    case "refusé":
      tagColor = "red";
      tagText = "Refusé";
      break;
    case "accepté":
      tagColor = "green";
      tagText = "Accepté";
      break;
    default:
      tagColor = "default";
      tagText = "Statut inconnu";
  }

  return (
    <div className="candidature-card">
      <div className="content">
        <h3>{stageTitle}</h3>
        <p>{candidatureDate}</p>
      </div>
      <div className="tag_status">
        <Tag color={tagColor} >{tagText}</Tag>
      </div>
    </div>
  );
};

export default CandidatureCard;
