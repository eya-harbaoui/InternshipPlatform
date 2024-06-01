// Candidatures.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import CandidatureCard from "../../components/CandidatureCard/CandidatureCard";
import { MdOutlineWorkHistory } from "react-icons/md";
import "./Candidatures.css";
import "../../components/CandidatureCard/ListeCandidatureCard.css";
import getUserIdFromLocalStorage from "../../UserAuth.js";
import { NavbarLinks } from "../../components/Navbar/NavbarLinks";
import { useNavigate, useLocation } from "react-router-dom";

const Candidatures = () => {
  const { role, userId } = getUserIdFromLocalStorage() || {};
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true); // Ajout d'une variable de chargement
  const navigate = useNavigate();

  const fetchCandidatures = async () => {
    try {
      console.log(userId, "user");
      const candidatureResponse = await axios.get(
        `http://localhost:8000/application/historique_candidatures/${userId}`
      );

      setCandidatures(candidatureResponse.data);
      console.log(candidatures, "candidatures");
      setLoading(false); // Mettre à jour la variable de chargement une fois les données chargées
    } catch (error) {
      console.error("Error:", error);
      setLoading(false); // Mettre à jour la variable de chargement en cas d'erreur
    }
  };

  useEffect(() => {
    fetchCandidatures();
    console.log(candidatures, "candidatures");
  }); // Appel uniquement au chargement initial

  const handleTitleClick = (
    _id,
    title,
    nature,
    details,
    domain,
    mode,
    period,
    skills,
    createdAt
  ) => {
    const Link = "/Offres/" + _id;
    navigate(Link, {
      state: {
        jobDetails: {
          _id,
          title,
          nature,
          details,
          domain,
          mode,
          period,
          skills,
          createdAt,
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
                candidatureDate={candidature.createdAt}
                candidatureStatus={candidature.status}
                Title={candidature.offer.title}
                onClickTitle={() =>
                  handleTitleClick(
                    candidature.offer._id,
                    candidature.offer.title,
                    candidature.offer.nature,
                    candidature.offer.details,
                    candidature.offer.domain,
                    candidature.offer.mode,
                    candidature.offer.period,
                    candidature.offer.skills,
                    candidature.offer.createdAt
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
