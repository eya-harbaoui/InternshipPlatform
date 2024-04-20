// CandidatureCard.js
import React from "react";
import { Tag } from "antd";
import "./ListeCandidatureCard.css";
import { getStatusTag } from "./statusUtils";

const CandidatureCard = ({
  Title,
  candidatureDate,
  candidatureStatus,
}) => {
  const { tagColor, tagText } = getStatusTag(candidatureStatus);
  return (
    <>
      <div className="title-and-tag">
        <h3>{Title}</h3>
        <Tag color={tagColor} className="status_tag">
          {tagText}
        </Tag>
      </div>
      <p> Date de candidature : {candidatureDate}</p>
    </>
  );
};

export default CandidatureCard;
