import React from "react";
import CandidatureCard from "./CandidatureCard";
import { Popover } from "antd";
import "./ListeCandidatureCard.css";

const ListeCandidatureCard = ({
  Title,
  candidatureStatus,
  candidatureDate,
  actions,
  statusRefusePopover,
  onClickTitle
}) => {
  return (
    <div className="candidature-card">
      <CandidatureCard
        Title={Title}
        candidatureDate={candidatureDate}
        candidatureStatus={candidatureStatus}
        statusRefusePopover={statusRefusePopover}
        onClickTitle={onClickTitle}
      />
      <div className="actions">
        {actions.map((action, index) => (
          <span
            key={index}
            className={`action ${action.disabled ? "disabled" : ""}`}
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
