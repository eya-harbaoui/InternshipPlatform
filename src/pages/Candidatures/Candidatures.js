// Candidatures.js
import React from "react";
import { NavbarLinks } from "../../components/Navbar/NavbarLinks";
import Navbar from "../../components/Navbar/Navbar";
import CandidatureCard from "../../components/CandidatureCard/CandidatureCard";
import { CandidatureData } from "./CandidaturesData";
import { MdOutlineWorkHistory } from "react-icons/md";
import "./Candidatures.css";

const Candidatures = () => {
  return (
    <div className="candidatures-page">
      <Navbar links={NavbarLinks} />
      <h2 className="title-candidature">Mes candidatures</h2>
      <MdOutlineWorkHistory className="candidature-icon"/>
      <div className="candidature-cards">
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
