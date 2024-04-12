import React from "react";
import { Tag } from "antd";
import "./ListeCandidatureCard.css";
import { BiMailSend } from "react-icons/bi";
import { ImProfile } from "react-icons/im";

const ListeCandidatureCard = ({
  CandidateName,
  CandidatSurName,
  CandidatureStatus,
  CandidatureDate,
}) => {
  let tagColor = "";
  let tagText = "";

  switch (CandidatureStatus.toLowerCase()) {
    case "en cours":
      tagColor = "blue";
      tagText = "en cours";
      break;
    case "entretien technique/rh programmé":
      tagColor = "green";
      tagText = "entretien programmé";
      break;
    case "refusé":
      tagColor = "red";
      tagText = "refusé";
      break;
    case "accepté":
      tagColor = "green";
      tagText = "accepté";
      break;
    default:
      tagColor = "default";
      tagText = "statut inconnu";
  }

  return (
    <div className="liste-candidature-card">
      <div className="content-candidat">
        <h3>
          {CandidateName} {CandidatSurName}
        </h3>
        <div className="actions">
          <span className="action">
            <BiMailSend className="action-icon" />
            Programmer un entretien
          </span>
          <span className="action">
            <ImProfile className="action-icon" />
            Voir profil
          </span>
        </div>
        <p> A postulé le : {CandidatureDate}</p>
      </div>
      <Tag color={tagColor} className="status-tag">
        {tagText}
      </Tag>
    </div>
  );
};

export default ListeCandidatureCard;
