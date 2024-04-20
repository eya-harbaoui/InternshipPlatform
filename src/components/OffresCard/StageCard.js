import React, { useState } from "react";
import { FaRegLightbulb, FaRegCalendarAlt } from "react-icons/fa";
import { FiHome } from "react-icons/fi";
import "./OffresCard.css";
import { MdUpdate } from "react-icons/md";

const StageCard = ({
  stageTitle,
  stageNature,
  stageDescription,
  domainTag,
  modeTag,
  durationTag,
  publicationDate,
  student,
  buttonName,
  handleButtonFunction,
}) => {
  const maxWords = 20; // Nombre maximum de mots à afficher initialement
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const getDescriptionPreview = () => {
    const words = stageDescription.split(" ");
    return words.slice(0, maxWords).join(" ");
  };

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
        <p>
          {showFullDescription ? stageDescription : getDescriptionPreview()}
          {stageDescription.split(" ").length > maxWords && (
            <span>
              {" "}
              {/* Espace avant le lien "Read More" */}
              <span
                className="read-more-link"
                onClick={toggleDescription}
                style={{
                  color: "#FF735C",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                {showFullDescription ? "Show Less" : "Read More"}
              </span>
            </span>
          )}
        </p>
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
          {student && (
            <div className="tag">
              <MdUpdate /> {publicationDate}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StageCard;
