import React, { useState } from "react";
import {
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { Tag } from "antd";


const ListeCandidatureCard = ({ firstName, lastName, candidatureStatus,candidatureDate,firstButtonName,secondButtonName }) => {
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
    <div className="stage-card">
      <div className="title-and-publish">
        <h3>
          {firstName} {lastName}
        </h3>
        <Tag color={tagColor} className="status-tag">
          {tagText}
        </Tag>
      </div>
      <div className="content">
        <p>A postulé le : {candidatureDate}</p>
      </div>
      <div className="actions">
        <span className="action">
          <FaEdit className="action-icon" />
          {firstButtonName}
        </span>
        <span className="action">
          <FaTrash className="action-icon" />
          {secondButtonName}
        </span>
      </div>
    </div>
  );
};

export default ListeCandidatureCard;
