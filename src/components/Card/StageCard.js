import React from "react";
import { FaRegLightbulb, FaRegCalendarAlt } from "react-icons/fa";
import { FiHome } from "react-icons/fi";
import "./StageCard.css";
import { useNavigate } from "react-router-dom";

const StageCard = ({
  stageTitle,
  stageNature,
  stageDescription,
  domainTag,
  modeTag,
  durationTag,
  offerLink,
}) => {
const navigate = useNavigate();
  
 
const handlePostulerClick = () => {
 navigate(`/Offres/${offerLink}`);
};
  return (
    <div className="stage-card">
      <div className="content">
        <h2>{stageTitle}</h2>
        <p>{stageNature}</p>
        <p>{stageDescription}</p>
        <div className="tags">
          <div className="tag">
            <FaRegLightbulb /> {domainTag}
          </div>
          <div className="tag">
            <FiHome /> {modeTag}
          </div>
          <div className="tag">
            <FaRegCalendarAlt /> {durationTag}
          </div>
        </div>
      </div>
      <button className="read-more" onClick={handlePostulerClick}>
        Voir offre
      </button>
    </div>
  );
};

export default StageCard;
