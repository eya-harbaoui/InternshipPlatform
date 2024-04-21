import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaArchive } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import "./ManagerOfferCard.css";
import { Tag, Modal, Select } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StageCard from "../OffresCard/StageCard.js";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const { Option } = Select;

const ManagerOfferCard = ({
  id,
  offerLink,
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
  const [selectedOffer, setSelectedOffer] = useState({
    id: id,
    stageTitle: stageTitle,
    stageNature: stageNature,
    modeTag: modeTag,
    domainTag: domainTag,
    durationTag: durationTag,
    stageDescription: stageDescription,
    competences: competences,
    OfferStatus: OfferStatus,
    publicationDate: publicationDate,
    offerLink: offerLink,
  });

  const handlePublishClick = async () => {
    try {
      // Implement your publish logic here
      await axios.put(`http://localhost:8000/offers/${selectedOffer.id}`, {
        ...selectedOffer,
        OfferStatus: "publié",
      });
      toast.success("Offre validée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la publication de l'offre :", error);
      toast.error("Erreur lors de la publication de l'offre");
    }
  };

  return (
    <>
      <div className="stage-card">
        <StageCard
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
          <span className="action">
            <FaUserGroup className="action-icon" />
            Voir offre
          </span>
        </div>
      </div>
    </>
  );
};

export default ManagerOfferCard;
