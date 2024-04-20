import React, { useState } from "react";
import CandidatureCard from "./CandidatureCard";
import "./ListeCandidatureCard.css";

const ListeCandidatureCard = ({
  Title,
  candidatureStatus,
  candidatureDate,
  firstButtonName,
  secondButtonName,
  FirstIcon: FirstIcon,
  SecondIcon: SecondIcon,
}) => {
  let tagColor = "";
  let tagText = "";
  switch (candidatureStatus) {
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

  return (
    <div className="candidature-card">
      <CandidatureCard
        Title={Title}
        candidatureDate={candidatureDate}
        candidatureStatus={candidatureStatus}
      ></CandidatureCard>
      <div className="actions">
        <span className="action">
          {FirstIcon && <FirstIcon className="action-icon" />}
          {firstButtonName}
        </span>
        <span className="action">
          {SecondIcon && <SecondIcon className="action-icon" />}
          {secondButtonName}
        </span>
      </div>
    </div>
  );
};

export default ListeCandidatureCard;
