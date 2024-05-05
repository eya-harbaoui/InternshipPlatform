//import
import React, { useState, useEffect } from "react";
import ManagerOfferCard from "../../components/ManagerOfferCard/ManagerOfferCard.js";
import "./ManagerValidation.css";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import Filter from "../../components/Filter/Filter";
import { MdOutlineContentPasteSearch } from "react-icons/md";
import { ManagerNavbarLinks } from "../../components/Navbar/ManagerNavbarLinks";

const ManagerValidation = () => {
  //Define the states and functions
  const [filter, setFilter] = useState({
    searchTerm: "",
    domain: "",
    duration: "",
    mode: "",
    nature: "",
  });
  const [data, setData] = useState([]);

  const handleClearFilter = () => {
    setFilter({
      searchTerm: "",
      domain: "",
      duration: "",
      mode: "",
      nature: "",
    });
  };

  const handleFilterChange = (key, value) => {
    setFilter({ ...filter, [key]: value });
  };

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

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/offers", {
        params: {
          OfferStatus: "en cours de validation", // Spécifiez le statut de l'offre à filtrer ici
        },
      });
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
  });

  return (
    <div className="offres-RH-page">
      <Navbar links={ManagerNavbarLinks} />
      <h2 className="title-offre-RH">Validation des Offres</h2>
      <MdOutlineContentPasteSearch className="icon-offre-RH" />
      <Filter
        filter={filter}
        setFilter={setFilter}
        handleClear={handleClearFilter}
      />
      <div className="stage-cards-RH">
        {filteredStageData.map((stage, index) => (
          <ManagerOfferCard key={index} {...stage} />
        ))}
      </div>
    </div>
  );
};

export default ManagerValidation;
