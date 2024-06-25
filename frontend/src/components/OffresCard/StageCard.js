import React, { useState } from "react";
import { FaRegLightbulb, FaRegCalendarAlt } from "react-icons/fa";
import { FiHome } from "react-icons/fi";
import "./OffresCard.css";
import { MdUpdate } from "react-icons/md";

const StageCard = ({
  _id,
  title,
  nature,
  details,
  domain,
  mode,
  period,
  createdAt,
  student,
  buttonName,
  handleButtonFunction,
  viewButton,
}) => {
  const maxWords = 20; // Nombre maximum de mots à afficher initialement
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const getDescriptionPreview = () => {
    const words = details.split(" ");
    return words.slice(0, maxWords).join(" ");
  };

  return (
    <>
      <div className="title-and-publish">
        <h2>{title}</h2>

        {viewButton && (
          <button className="small-button" onClick={handleButtonFunction}>
            {buttonName}
          </button>
        )}
      </div>
      <div className="content">
        <p>{nature}</p>
        <p>
          {showFullDescription ? details : getDescriptionPreview()}
          {details.split(" ").length > maxWords && (
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
                {showFullDescription ? "Voir Moins" : "Voir Plus"}
              </span>
            </span>
          )}
        </p>
        <div className="tags">
          <div className="tag">
            <FaRegLightbulb /> {domain.name}
          </div>
          <div className="tag">
            <FiHome /> {mode}
          </div>
          <div className="tag">
            <FaRegCalendarAlt /> {period + " Mois"}
          </div>
          {student && (
            <div className="tag">
              <MdUpdate /> {createdAt}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StageCard;
