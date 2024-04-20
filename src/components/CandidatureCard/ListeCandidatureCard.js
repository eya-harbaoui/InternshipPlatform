import React, { useState } from "react";
import CandidatureCard from "./CandidatureCard";
import { Popover } from "antd";
import "./ListeCandidatureCard.css";
const ListeCandidatureCard = ({
  Title,
  candidatureStatus,
  candidatureDate,
  firstButtonName,
  secondButtonName,
  FirstIcon: FirstIcon,
  SecondIcon: SecondIcon,
  firstButtonFunction,
  isProgramInterviewDisabled,
  
}) => {
  
  return (
    <div className="candidature-card">
      <CandidatureCard
        Title={Title}
        candidatureDate={candidatureDate}
        candidatureStatus={candidatureStatus}
      ></CandidatureCard>
      <div className="actions">
        <span
          className="action"
          onClick={firstButtonFunction}
          disabled={isProgramInterviewDisabled}
        >
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
