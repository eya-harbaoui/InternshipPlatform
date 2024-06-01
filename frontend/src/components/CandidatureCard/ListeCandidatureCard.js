import React from "react";
import CandidatureCard from "./CandidatureCard";
import { Popover } from "antd";
import "./ListeCandidatureCard.css";

const ListeCandidatureCard = ({
  title,
  status,
  createdAt,
  actions,
  statusRefusePopover,
  onClickTitle
}) => {
  return (
    <div className="candidature-card">
      <CandidatureCard
        title={title}
        createdAt={createdAt}
        status={status}
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
