// CandidatureCard.js
import React from "react";
import { Tag } from "antd";
import "./ListeCandidatureCard.css";

const CandidatureCard = ({
  icon,
  Title,
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
    <>
      <div className="title-and-tag">
        <h3>{Title}</h3>
        <Tag color={tagColor} className="status_tag">{tagText}</Tag>
      </div>
      <p> Date de candidature : {candidatureDate}</p>
    </>
  );
};

export default CandidatureCard;
