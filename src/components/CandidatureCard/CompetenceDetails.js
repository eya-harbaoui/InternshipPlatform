import React, { useState, useEffect } from "react";
import axios from "axios";

const CompetenceDetails = ({ candidatureId }) => {
  const [competences, setCompetences] = useState([]);
  const [adequacyPercentage, setAdequacyPercentage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/Student_Application/${candidatureId}`
        );
        const { competencesCandidat, adequacyPercentage } = response.data;
        setCompetences(competencesCandidat);
        setAdequacyPercentage(adequacyPercentage);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [candidatureId]);

  const getAdequacyColor = (percentage) => {
    if (percentage <= 20) return "#ff7f7f"; // Rouge doux
    if (percentage <= 50) return "#ffd700"; // Jaune doux
    if (percentage <= 70) return "#ffa500"; // Orange doux
    return "#90ee90"; // Vert doux
  };

  return (
    <div>
      <h3>Compétences Candidats Après l'entretien technique</h3>
      {competences.map((competence, index) => (
        <div key={index}>
          <p>
            <strong>Nom de compétence: </strong>
            {competence.nom}
          </p>
          <p>
            <strong>Niveau demandé: </strong>
            {competence.niveauDemande}
          </p>
          <p>
            <strong>Niveau acquis: </strong>
            {competence.niveauAcquis}
          </p>
          <p>
            <strong>Pourcentage d'adéquation:</strong>{" "}
            {competence.pourcentageAdequation}%{" "}
          </p>
          <hr />
        </div>
      ))}
      <h3 style={{ color: getAdequacyColor(adequacyPercentage) }}>
        Pourcentage global d'adéquation: {adequacyPercentage}%
      </h3>
    </div>
  );
};

export default CompetenceDetails;
