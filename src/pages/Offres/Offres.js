import React, { useState, useEffect } from "react";
import axios from "axios";
import StageCard from "../../components/OffresCard/StageCard";
import "./Offres.css";
import "../../components/OffresCard/OffresCard.css"
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import Filter from "../../components/Filter/Filter";
import { MdOutlineContentPasteSearch } from "react-icons/md";
import { NavbarLinks } from "../../components/Navbar/NavbarLinks";
const Offres = () => {
  const handlePostulerClick = (
    offerId,
    stageTitle,
    stageNature,
    stageDescription,
    domainTag,
    modeTag,
    durationTag,
    competences
  ) => {
    navigate(`/Offres/${offerId}`, {
      state: {
        jobDetails: {
          stageTitle,
          stageNature,
          stageDescription,
          domainTag,
          modeTag,
          durationTag,
          competences,
        },
      },
    });
  };
  const [filter, setFilter] = useState({
    searchTerm: "",
    domain: "",
    duration: "",
    mode: "",
    nature: "",
  });
  const navigate = useNavigate();

  // your existing code for fetching data and handling postuler click

  const handleClearFilter = () => {
    setFilter({
      searchTerm: "",
      domain: "",
      duration: "",
      mode: "",
      nature: "",
    });
  };
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/offers");
      setData(response.data);
      console.log("data", data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);



  const filteredStageData = data.filter((stage) => {
    return (
      stage.stageTitle
        .toLowerCase()
        .includes(filter.searchTerm.toLowerCase()) &&
      (filter.domain === "" || stage.domainTag === filter.domain) &&
      (filter.duration === "" || stage.durationTag === filter.duration) &&
      (filter.mode === "" || stage.modeTag === filter.mode) &&
      (filter.nature === "" || stage.stageNature === filter.nature)
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
          <div className="stage-card">
            <StageCard
              key={index}
              {...stage}
              buttonName={"Voir plus"}
              handleButtonFunction={() =>
                handlePostulerClick(
                  stage.id,
                  stage.stageTitle,
                  stage.stageNature,
                  stage.stageDescription,
                  stage.domainTag,
                  stage.modeTag,
                  stage.durationTag,
                  stage.competences
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
