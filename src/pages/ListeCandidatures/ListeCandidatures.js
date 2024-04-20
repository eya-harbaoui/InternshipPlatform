import React, { useState } from "react";
import { Select, Button, Row, Col } from "antd";
import { FaRegUser } from "react-icons/fa";
import CandidatsCard from "../../components/CandidatsCard/CandidatsCard";
import ListeCandidatureCard from "../../components/CandidatureCard/ListeCandidatureCard";
import { RHNavbarLinks } from "../../components/Navbar/RHNavbarLinks";
import Navbar from "../../components/Navbar/Navbar";
import { BsSend } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";

const ListeCandidatures = () => {
  const { Option } = Select;
  const candidatures = [
    { status: "en cours", nombreCandidats: 10 },
    { status: "entretien technique/RH programmé", nombreCandidats: 12 },
    { status: "refusé", nombreCandidats: 8 },
    { status: "accepté", nombreCandidats: 3 },
  ];

  const candidats = [
    {
      id: 1,
      nom: "Eya",
      prenom: "Harbaoui",
      statut: "accepté",
      date: "10/12/2023",
    },
    { id: 2, nom: "John", prenom: "Doe", statut: "refusé", date: "11/12/2023" },
    {
      id: 3,
      nom: "Alice",
      prenom: "Smith",
      statut: "en cours",
      date: "12/12/2023",
    },
    {
      id: 4,
      nom: "Bob",
      prenom: "Johnson",
      statut: "entretien technique/RH programmé",
      date: "13/12/2023",
    },
    {
      id: 5,
      nom: "ali",
      prenom: "mohssen",
      statut: "entretien technique/RH programmé",
      date: "17/12/2023",
    },
    {
      id: 6,
      nom: "ahmed",
      prenom: "ben mostfa",
      statut: "entretien technique/RH programmé",
      date: "18/12/2023",
    },
  ];

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
          Title={`${candidat.nom} ${candidat.prenom}`}
          candidatureStatus={candidat.statut}
          candidatureDate={candidat.date}
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
