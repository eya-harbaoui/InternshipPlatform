// Candidatures.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import CandidatureCard from "../../components/CandidatureCard/CandidatureCard";
import { MdOutlineWorkHistory } from "react-icons/md";
import "./Candidatures.css";
import "../../components/CandidatureCard/ListeCandidatureCard.css";
import { NavbarLinks } from "../../components/Navbar/NavbarLinks";
import { useNavigate, useLocation } from "react-router-dom";

const Candidatures = () => {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true); // Ajout d'une variable de chargement
  const navigate = useNavigate();

  const fetchCandidatures = async () => {
    try {
      const studentsResponse = await axios.get(
        "http://localhost:8000/Students"
      );
      const userId = studentsResponse.data[0].id;

      const candidatureResponse = await axios.get(
        `http://localhost:8000/Student_Application?studentId=${userId}`
      );

      const candidaturesData = await Promise.all(
        candidatureResponse.data.map(async (candidature) => {
          const offerResponse = await axios.get(
            `http://localhost:8000/offers/${candidature.OfferId}`
          );
          console.log("offerResponse", offerResponse);
          return {
            ...candidature,
            OfferId: offerResponse.data.id,
            offerTitle: offerResponse.data.stageTitle,
            offerNature: offerResponse.data.stageNature,
            offerDescription: offerResponse.data.stageDescription,
            offerDomain: offerResponse.data.domainTag,
            offerMode: offerResponse.data.modeTag,
            offerDuration: offerResponse.data.durationTag,
            offerCompetences: offerResponse.data.competences,
            offerPublicationDate: offerResponse.data.publicationDate,
          };
        })
      );
      setCandidatures(candidaturesData);
      console.log(candidatures, "candidaaaaatures");
      console.log(candidaturesData, "candidatureees dataaa");
      setLoading(false); // Mettre à jour la variable de chargement une fois les données chargées
    } catch (error) {
      console.error("Error:", error);
      setLoading(false); // Mettre à jour la variable de chargement en cas d'erreur
    }
  };

  useEffect(() => {
    fetchCandidatures();
    console.log(candidatures, "candidatures");
  }, []); // Appel uniquement au chargement initial

  const handleTitleClick = (
    id,
    stageTitle,
    stageNature,
    stageDescription,
    domainTag,
    modeTag,
    durationTag,
    competences,
    publicationDate
  ) => {
    const Link = "/Offres/" + id;
    navigate(Link, {
      state: {
        jobDetails: {
          id,
          stageTitle,
          stageNature,
          stageDescription,
          domainTag,
          modeTag,
          durationTag,
          competences,
          publicationDate,
        },
      },
    });
  };

  return (
    <div className="candidatures-page">
      <Navbar links={NavbarLinks} />
      <h2 className="title-candidature">Mes candidatures</h2>
      <MdOutlineWorkHistory className="candidature-icon" />
      <div className="candidature-cards">
        {loading ? (
          <p>Loading...</p>
        ) : (
          candidatures.map((candidature, index) => (
            <div className="candidature-card" key={index}>
              <CandidatureCard
                candidatureDate={candidature.candidatureDate}
                candidatureStatus={candidature.candidatureStatus}
                Title={candidature.offerTitle}
                onClickTitle={() =>
                  handleTitleClick(
                    candidature.OfferId,
                    candidature.offerTitle,
                    candidature.offerNature,
                    candidature.offerDescription,
                    candidature.offerDomain,
                    candidature.offerMode,
                    candidature.offerDuration,
                    candidature.offerCompetences,
                    candidature.offerPublicationDate
                  )
                }
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Candidatures;
