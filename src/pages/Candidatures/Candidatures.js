// Candidatures.js
import React , {useState} from "react";
import Navbar from "../../components/Navbar/Navbar";
import CandidatureCard from "../../components/CandidatureCard/CandidatureCard";
import { CandidatureData } from "./CandidaturesData";
import { MdOutlineWorkHistory } from "react-icons/md";
import "./Candidatures.css";
import { RHNavbarLinks } from "../../components/Navbar/RHNavbarLinks";

const Candidatures = () => {
 
  return (
    <div className="candidatures-page">
      <Navbar links={RHNavbarLinks} />
      <h2 className="title-candidature">Mes candidatures</h2>
      <MdOutlineWorkHistory className="candidature-icon" />
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
