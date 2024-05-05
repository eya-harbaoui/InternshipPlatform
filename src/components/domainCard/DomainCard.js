import React from "react";
import { FaRegLightbulb, FaRegCalendarAlt } from "react-icons/fa";
import { FiHome } from "react-icons/fi";
import { MdUpdate } from "react-icons/md";
import "./DomainCard.css";

const DomainCard = ({
  domainName,
  competences,
  handleEditCompetence,
  handleDeleteCompetence,
}) => {
  return (
    <div className="domain-card">
      <div className="domain-info">
        <div className="domain-icon">
          <FaRegLightbulb />
        </div>
        <div className="domain-name">{domainName}</div>
      </div>
      <div className="competences">
        {competences.map((competence, index) => (
          <div key={index} className="competence-tag">
            {competence}
            <span
              className="edit-icon"
              onClick={() => handleEditCompetence(index)}
            >
              <FiHome />
            </span>
            <span
              className="delete-icon"
              onClick={() => handleDeleteCompetence(index)}
            >
              <MdUpdate />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DomainCard;
