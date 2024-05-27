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
              <label htmlFor="title">Titre de stage :</label>
              <input
                type="text"
                id="title"
                placeholder="Titre de stage"
                className="input-text-design"
                value={title}
              />
              <label htmlFor="details">Description de stage :</label>
              <textarea
                id="details"
                type="text"
                placeholder="Description de stage"
                className="textarea-design"
                value={details}
              />
              <label htmlFor="domaineSelectionne">Domaine de stage :</label>
              <input
                id="domaineSelectionne"
                placeholder="Domaine de stage"
                className="input-text-design"
                style={{ width: "100%" }}
                value={domain}
              />
              <label htmlFor="mode">Mode de stage :</label>
              <input
                id="mode"
                placeholder="Mode de stage"
                className="input-text-design"
                style={{ width: "100%" }}
                value={mode}
              />
              <label htmlFor="period">Durée de stage :</label>
              <input
                id="period"
                placeholder="Durée de stage"
                className="input-text-design"
                style={{ width: "100%" }}
                value={period}
              />
              <label htmlFor="nature">Nature de stage :</label>
              <input
                id="nature"
                placeholder="Nature de stage"
                className="input-text-design"
                style={{ width: "100%" }}
                value={nature}
              />
              <div className="skills-container">
                <h3>Compétences demandées :</h3>
                {Object.entries(skills).map(([skill, level]) => (
                  <p key={skill}>
                    {skill}: {level}
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
