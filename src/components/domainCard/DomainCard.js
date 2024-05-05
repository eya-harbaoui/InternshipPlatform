import React from "react";
import { FaRegLightbulb, FaRegCalendarAlt } from "react-icons/fa";
import { FiEdit, FiTrash } from "react-icons/fi";
import { Tag } from "antd";
import "./DomainCard.css";

const DomainCard = ({
  domainName,
  competences,
  handleEdit,
  handleDelete,
}) => {
  return (
    <div className="domain-card">
      <div className="domain-info">
        <FaRegLightbulb className="domain-icon" />
        <div className="domain-name">{domainName}</div>
      </div>
      <div className="competences">
        {competences.map((competence, index) => (
          <Tag
            key={index}
            className="competence-tag"
          >
            {competence}
          </Tag>
        ))}
      </div>
      <div className="edit-delete-icons">
        <FiEdit className="edit-icon" onClick={handleEdit}/>
        <FiTrash className="delete-icon" onClick={handleDelete}/>
      </div>
    </div>
  );
};

export default DomainCard;
