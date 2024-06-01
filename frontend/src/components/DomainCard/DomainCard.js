import React from "react";
import { FaRegLightbulb, FaRegCalendarAlt } from "react-icons/fa";
import { FiEdit, FiTrash } from "react-icons/fi";
import { Tag } from "antd";
import "./DomainCard.css";

const DomainCard = ({
  name,
  skills,
  handleEdit,
  handleDelete,
}) => {
  return (
    <div className="domain-card">
      <div className="domain-info">
        <FaRegLightbulb className="domain-icon" />
        <div className="domain-name">{name}</div>
      </div>
      <div className="competences">
        {skills.map((skillItem) => (
          <Tag
            key={skillItem.skill._id}
            className="competence-tag"
          >
            {skillItem.skill.name}
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
