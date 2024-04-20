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
