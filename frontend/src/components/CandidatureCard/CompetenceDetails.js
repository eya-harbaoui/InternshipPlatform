import React, { useState, useEffect } from "react";
import axios from "axios";

const CompetenceDetails = ({ candidatureId }) => {
  const [applicantSkills, setApplicantSkills] = useState([]);
  const [adequacyPercentage, setAdequacyPercentage] = useState(0);
  const fetchData = async () => {
    try {
      console.log(candidatureId);
      const response = await axios.get(
        `http://localhost:8000/application/candidature_by_Id/${candidatureId}`
      );

      setApplicantSkills(response.data.applicantSkills);
      setAdequacyPercentage(response.data.adequacyPercentage);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
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
      <h4>Compétences du candidats après l'entretien technique</h4>
      {applicantSkills.map((skillItem) => (
        <div key={skillItem._id}>
          <p>
            <strong>Nom de compétence: </strong>
            {skillItem.skill.name}
          </p>
          <p>
            <strong>Niveau demandé: </strong>
            {skillItem.levelRequired}
          </p>
          <p>
            <strong>Niveau acquis: </strong>
            {skillItem.levelAcquired}
          </p>
          <p>
            <strong>Pourcentage d'adéquation:</strong>{" "}
            {skillItem.adequacyPercentage}%{" "}
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
