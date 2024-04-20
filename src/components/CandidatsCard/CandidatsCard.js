import React from "react";
import { Tag } from "antd";
import { FaRegUser } from "react-icons/fa";
import { getStatusTag } from "../../components/CandidatureCard/statusUtils";
import "./CandidatsCard.css";

const MaCarte = ({ candidatureStatus, nombreCandidats }) => {
const { tagColor, tagText } = getStatusTag(candidatureStatus);

  return (
    <div className="ma-carte">
      <div>
        <Tag color={tagColor}>{tagText}</Tag>
        <h2>{nombreCandidats} candidats</h2>
      </div>
      <FaRegUser className="user-icon" />
    </div>
  );
};

export default MaCarte;
