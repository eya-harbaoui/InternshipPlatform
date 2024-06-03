import React, { useState, useEffect } from "react";
import { FaUserGroup } from "react-icons/fa6";
import "./OffresCard.css";
import { Tag, Modal, Select, Input, InputNumber, Button } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StageCard from "./StageCard.js";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getStatusTag } from "./OffersStatus.js";
const { Option } = Select;
const { TextArea } = Input;

const OffreHistoryCardManager = ({
  _id,
  title,
  nature,
  details,
  domain,
  mode,
  period,
  status,
  skills,
  createdAt,
  userId,
}) => {
  //Define the states and functions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState({});

  //Modal de modification de l'offre
  const showModal = () => {
    setIsModalOpen(true);
    console.log("selectedOfferkkk", selectedOffer);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleViewOfferClick = () => {
    setIsModalOpen(false);
  };
  const maxWords = 20; // Nombre maximum de mots à afficher initialement
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const getDescriptionPreview = () => {
    const words = details.split(" ");
    return words.slice(0, maxWords).join(" ");
  };

  //Voir les candidature de l'offre sélectionnée

  const handleCandidatures = () => {
    navigate(`/liste_candidatures/${selectedOffer._id}`);
  };

  const navigate = useNavigate();
  let { tagColor, tagText } = getStatusTag(status);

  return (
    <>
      <div className="stage-card">
        <StageCard
          _id={_id}
          title={title}
          nature={nature}
          details={details}
          mode={mode}
          domain={domain}
          period={period}
          status={status}
        />
        <div className="actions">
          <span className="action" onClick={showModal}>
            <FaUserGroup className="action-icon" />
            Voir offre
          </span>
          <span className="action" onClick={handleCandidatures}>
            <FaUserGroup className="action-icon" />
            Candidatures
          </span>
        </div>

        <Tag color={tagColor} className="status-tag">
          {tagText}
        </Tag>
      </div>
      {isModalOpen && (
        <Modal
          title="Détails de l'offre"
          visible={isModalOpen}
          onOk={handleViewOfferClick}
          onCancel={handleViewOfferClick}
          footer={[
            <Button key="ok" type="primary" onClick={handleViewOfferClick}>
              Fermer
            </Button>,
          ]}
        >
          <div className="modal-content">
            <p>
              <strong>Titre de stage: </strong> {title}{" "}
            </p>
            <p>
              <strong>Description de stage: </strong>
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
            <p>
              <strong>Domaine de stage : </strong> {domain.name}{" "}
            </p>
            <p>
              <strong>Mode de stage : </strong> {mode}{" "}
            </p>
            <p>
              <strong>Durée de stage : </strong> {period + " Mois"}{" "}
            </p>
            <p>
              <strong>Nature de stage : </strong> {period + " Mois"}{" "}
            </p>

            <div className="skills-container">
              <h4>Compétences demandées :</h4>
              {skills.map((skillItem) => (
                <p key={skillItem.skill._id}>
                  {skillItem.skill.name}: {skillItem.level}
                </p>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default OffreHistoryCardManager;
