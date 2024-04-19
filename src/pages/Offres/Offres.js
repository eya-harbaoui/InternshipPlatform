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

  const handlePostulerClick = (
    id,
    stageTitle,
    stageNature,
    stageDescription,
    domainTag,
    modeTag,
    durationTag,
    competences,
    publicationDate,
  ) => {
    navigate(`/Offres/${id}`, {
      state: {
        jobDetails: {
          id,
          stageTitle,
          stageNature,
          stageDescription,
          domainTag,
          modeTag,
          durationTag,
          competences,
          publicationDate,
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
      const sortedData = response.data.sort((a, b) => {
        return new Date(b.publicationDate) - new Date(a.publicationDate);
      });
      setData(sortedData);
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
          <div className="stage-card" key={index}>
            <StageCard
              student={true}
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
