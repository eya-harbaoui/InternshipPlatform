import React from "react";
import CandidatureCard from "./CandidatureCard";
import { Popover } from "antd";
import "./ListeCandidatureCard.css";

const ListeCandidatureCard = ({
  Title,
  candidatureStatus,
  candidatureDate,
  actions,
  description,
}) => {
  return (
    <div className="candidature-card">
      <CandidatureCard
        Title={Title}
        candidatureDate={candidatureDate}
        candidatureStatus={candidatureStatus}
        description={description}
      />
      <div className="actions">
        {actions.map((action, index) => (
          <span
            key={index}
            className="action"
            onClick={action.onClick}
            disabled={action.disabled}
          >
            {action.Icon && <action.Icon className="action-icon" />}
            {action.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ListeCandidatureCard;
