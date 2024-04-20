import React, { useState, useEffect } from "react";
import { Select, Button, Row, Col } from "antd";
import { FaRegUser } from "react-icons/fa";
import CandidatsCard from "../../components/CandidatsCard/CandidatsCard";
import ListeCandidatureCard from "../../components/CandidatureCard/ListeCandidatureCard";
import { RHNavbarLinks } from "../../components/Navbar/RHNavbarLinks";
import Navbar from "../../components/Navbar/Navbar";
import { BsSend } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import axios from "axios";
import { useParams } from "react-router-dom";
const ListeCandidatures = () => {
  const { Option } = Select;
  const [candidatures, setCandidatures] = useState([
    { status: "en cours", nombreCandidats: 10 },
    { status: "entretien technique/RH programmé", nombreCandidats: 12 },
    { status: "refusé", nombreCandidats: 8 },
    { status: "accepté", nombreCandidats: 3 },
  ]);

  const [candidats, setCandidats] = useState([]);
  const { id } = useParams();
  const getStudentApplicationsForOffer = async () => {
    try {
      console.log("id",id);
      const response = await axios.get(
        `http://localhost:8000/Student_Application?OfferId=${id}`
      );
      console.log("Réponse du backend :", response.data);
      setCandidats(response.data); // Mettre à jour les candidats avec les données reçues du backend
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des candidatures étudiantes :",
        error
      );
    }
  };

  // Appeler la fonction pour récupérer les candidatures étudiantes pour l'offre spécifique
  useEffect(() => {
    getStudentApplicationsForOffer();
  },[]);

  return (
    <div className="offres-page">
      <Navbar links={RHNavbarLinks} />
      <h3 className="title-offre">Liste des candidats</h3>
      <FaRegUser className="icon-offre" />
      <Row gutter={[16, 16]}>
        {candidatures.map((candidature, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6}>
            <CandidatsCard
              candidatureStatus={candidature.status}
              nombreCandidats={candidature.nombreCandidats}
            />
          </Col>
        ))}
      </Row>
      {candidats.map((candidat) => (
        <ListeCandidatureCard
          key={candidat.id}
          Title={`${candidat.firstName} ${candidat.lastName}`}
          candidatureStatus={candidat.candidatureStatus}
          candidatureDate={candidat.candidatureDate}
          showActions={true}
          firstButtonName="programmer un entretien"
          secondButtonName="voir profil"
          FirstIcon={BsSend}
          SecondIcon={CgProfile}
        />
      ))}
    </div>
  );
};

export default ListeCandidatures;
