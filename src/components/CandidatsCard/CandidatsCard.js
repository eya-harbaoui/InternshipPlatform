import React from "react";
import { Tag } from "antd";
import { FaRegUser } from "react-icons/fa";

import "./CandidatsCard.css";

const MaCarte = ({ candidatureStatus, nombreCandidats }) => {
  let tagColor, tagText;

  switch (candidatureStatus) {
    case "en cours":
      tagColor = "blue";
      tagText = "En cours";
      break;
    case "entretien technique/RH programmé":
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
    <div className="ma-carte">
      <div>
        <Tag color={tagColor}>{tagText}</Tag>
        <h2>{nombreCandidats} candidats</h2>
      </div>
      <FaRegUser className="user-icon" />
    </div>
  );
};

export default MaCarte;
