import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaArchive } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import "./ManagerOfferCard.css";
import { Tag, Modal, Select, Button } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StageCard from "../OffresCard/StageCard.js";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const { Option } = Select;

const ManagerOfferCard = ({
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

  const handlePublishClick = async () => {
    try {
      const currentDate = new Date().toISOString();
      const updatedOffer = {
        _id: _id,
        title: title,
        nature: nature,
        mode: mode,
        domain: domain,
        period: period,
        details: details,
        skills: skills,
        status: "publié",
        createdAt: currentDate,
        validatedBy: userId,
      };
      const response = await axios.put(
        `http://localhost:8000/offre/${_id}`,
        updatedOffer
      );
      console.log("Response:", response);
      toast.success("Offre validée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la publication de l'offre :", error);
      toast.error("Erreur lors de la publication de l'offre");
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
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

  return (
    <>
      <div className="stage-card">
        <StageCard
          _id={_id}
          student={false}
          title={title}
          nature={nature}
          details={details}
          mode={mode}
          domain={domain}
          period={period}
          buttonName={"Valider Offre"}
          handleButtonFunction={handlePublishClick}
          status={status}
          viewButton={true}
        />
        <div className="actions">
          <span className="action" onClick={showModal}>
            <FaUserGroup className="action-icon" />
            Voir offre
          </span>
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
                <strong>Nature de stage : </strong> {nature}{" "}
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
      </div>
    </>
  );
};

export default ManagerOfferCard;
