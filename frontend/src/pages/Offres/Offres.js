import React, { useState, useEffect } from "react";
import axios from "axios";
import StageCard from "../../components/OffresCard/StageCard";
import "./Offres.css";
import "../../components/OffresCard/OffresCard.css";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import Filter from "../../components/Filter/Filter";
import { MdOutlineContentPasteSearch } from "react-icons/md";
import { NavbarLinks } from "../../components/Navbar/NavbarLinks";

const Offres = () => {
  const navigate = useNavigate();

  //Naviguer vers les détails de l'offre pour postuler

  const handlePostulerClick = (
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
    navigate(`/Offres/${_id}`, {
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

  const [filter, setFilter] = useState({
    searchTerm: "",
    domain: "",
    period: "",
    mode: "",
    nature: "",
  });

  const handleClearFilter = () => {
    setFilter({
      searchTerm: "",
      domain: "",
      period: "",
      mode: "",
      nature: "",
    });
  };

  const [data, setData] = useState([]);

  //Les offres avec le status publié

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/offre/students");
      const sortedData = response.data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setData(sortedData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
    console.log(data);
  });

  //Rechercher les offres par criteres : mode,durée,domaine et nature

  const filteredStageData = data.filter((stage) => {
    return (
      stage.title.toLowerCase().includes(filter.searchTerm.toLowerCase()) &&
      (filter.domain === "" || stage.domain._id === filter.domain) &&
      (filter.period === "" || stage.period === filter.period) &&
      (filter.mode === "" || stage.mode === filter.mode) &&
      (filter.nature === "" || stage.nature === filter.nature)
    );
  });

  return (
    <div className="offres-page">
      <Navbar links={NavbarLinks} />
      <h2 className="title-offre">Nos offres de stage</h2>
      <MdOutlineContentPasteSearch className="icon-offre" />
      <Filter
        filter={filter}
        setFilter={setFilter}
        handleClear={handleClearFilter}
      />
      <div className="stage-cards">
        {filteredStageData.map((stage, index) => (
          <div className="stage-card" key={index}>
            <StageCard
              student={true}
              {...stage}
              buttonName={"Voir plus"}
              handleButtonFunction={() =>
                handlePostulerClick(
                  stage._id,
                  stage.title,
                  stage.nature,
                  stage.details,
                  stage.domain,
                  stage.mode,
                  stage.period,
                  stage.skills
                )
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offres;
