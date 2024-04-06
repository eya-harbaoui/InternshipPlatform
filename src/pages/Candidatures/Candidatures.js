import React from "react";
import { NavbarLinks } from "../../components/Navbar/NavbarLinks";
import Navbar from "../../components/Navbar/Navbar";
import CandidatureCard from "../../components/CandidatureCard/CandidatureCard";
import { CandidatureData } from "./CandidaturesData";

const Candidatures = () => {
  return (
    <div className="candidatures-page">
      <Navbar links={NavbarLinks} />
      <div className="candidature-cards">
        <h1>Mes candidatures</h1>
        {CandidatureData.map((candidature, index) => (
          <CandidatureCard
            key={index}
            stageTitle={candidature.stageTitle}
            candidatureDate={candidature.candidatureDate}
            candidatureStatus={candidature.candidatureStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default Candidatures;
