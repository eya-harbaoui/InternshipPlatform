import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaArchive } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import "./ManagerOfferCard.css";
import { Tag, Modal, Select,Button } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StageCard from "../OffresCard/StageCard.js";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const { Option } = Select;

const ManagerOfferCard = ({
  id,
  stageTitle,
  stageNature,
  stageDescription,
  domainTag,
  modeTag,
  durationTag,
  OfferStatus,
  competences,
  publicationDate,
}) => {
  //Define the states and functions
  const [isModalOpen, setIsModalOpen] = useState(false);


 const handlePublishClick = async () => {
   try {
     const currentDate = new Date().toISOString();
     const updatedOffer = {
       id: id,
       stageTitle: stageTitle,
       stageNature: stageNature,
       modeTag: modeTag,
       domainTag: domainTag,
       durationTag: durationTag,
       stageDescription: stageDescription,
       competences: competences,
       OfferStatus: "publié",
       publicationDate: currentDate,
     };
     const response = await axios.put(
       `http://localhost:8000/offers/${id}`,
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
          id={id}
          student={false}
          stageTitle={stageTitle}
          stageNature={stageNature}
          stageDescription={stageDescription}
          modeTag={modeTag}
          domainTag={domainTag}
          durationTag={durationTag}
          buttonName={"Valider Offre"}
          handleButtonFunction={handlePublishClick}
          OfferStatus={OfferStatus}
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
              <label htmlFor="stageTitle">Titre de stage :</label>
              <input
                type="text"
                id="stageTitle"
                placeholder="Titre de stage"
                className="input-text-design"
                value={stageTitle}
              />
              <label htmlFor="stageDescription">Description de stage :</label>
              <textarea
                id="stageDescription"
                type="text"
                placeholder="Description de stage"
                className="textarea-design"
                value={stageDescription}
              />
              <label htmlFor="domaineSelectionne">Domaine de stage :</label>
              <input
                id="domaineSelectionne"
                placeholder="Domaine de stage"
                className="input-text-design"
                style={{ width: "100%" }}
                value={domainTag}
              />
              <label htmlFor="modeTag">Mode de stage :</label>
              <input
                id="modeTag"
                placeholder="Mode de stage"
                className="input-text-design"
                style={{ width: "100%" }}
                value={modeTag}
              />
              <label htmlFor="durationTag">Durée de stage :</label>
              <input
                id="durationTag"
                placeholder="Durée de stage"
                className="input-text-design"
                style={{ width: "100%" }}
                value={durationTag}
              />
              <label htmlFor="stageNature">Nature de stage :</label>
              <input
                id="stageNature"
                placeholder="Nature de stage"
                className="input-text-design"
                style={{ width: "100%" }}
                value={stageNature}
              />
              <div className="competences-container">
                <h3>Compétences demandées :</h3>
                {Object.entries(competences).map(([competence, niveau]) => (
                  <p key={competence}>
                    {competence}: {niveau}
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
