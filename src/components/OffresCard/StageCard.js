import React from "react";
import { FaRegLightbulb, FaRegCalendarAlt } from "react-icons/fa";
import { FiHome } from "react-icons/fi";
import "./OffresCard.css";

const StageCard = ({
  stageTitle,
  stageNature,
  stageDescription,
  domainTag,
  modeTag,
  durationTag,
  buttonName,
  handleButtonFunction,
}) => {
  return (
    <>
      <div className="title-and-publish">
        <h2>{stageTitle}</h2>
        <button className="small-button" onClick={handleButtonFunction}>
          {buttonName}
        </button>
      </div>
      <div className="content">
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
    </>
  );
};

export default StageCard;
