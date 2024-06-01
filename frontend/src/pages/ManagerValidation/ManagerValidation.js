//import
import React, { useState, useEffect } from "react";
import ManagerOfferCard from "../../components/ManagerOfferCard/ManagerOfferCard.js";
import "./ManagerValidation.css";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import Filter from "../../components/Filter/Filter";
import { MdOutlineContentPasteSearch } from "react-icons/md";
import { ManagerNavbarLinks } from "../../components/Navbar/ManagerNavbarLinks";
import getUserIdFromLocalStorage from "../../UserAuth.js";

const ManagerValidation = () => {
  //Define the states and functions
  const [filter, setFilter] = useState({
    searchTerm: "",
    domain: "",
    period: "",
    mode: "",
    nature: "",
  });
  const [data, setData] = useState([]);
  const { role, userId } = getUserIdFromLocalStorage() || {};

  const handleClearFilter = () => {
    setFilter({
      searchTerm: "",
      domain: "",
      period: "",
      mode: "",
      nature: "",
    });
  };

  const handleFilterChange = (key, value) => {
    setFilter({ ...filter, [key]: value });
  };

  // Fonction pour filtrer les données des offres en fonction des filtres sélectionnés
  const filteredStageData = data.filter((stage) => {
    return (
      stage.title.toLowerCase().includes(filter.searchTerm.toLowerCase()) &&
      (filter.domain === "" || stage.domain._id === filter.domain) &&
      (filter.period === "" || stage.period === filter.period) &&
      (filter.mode === "" || stage.mode === filter.mode) &&
      (filter.nature === "" || stage.nature === filter.nature)
    );
  });
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/offre/none_validated_offres"
      );
      const sortedData = response.data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setData(sortedData);
      console.log(sortedData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  });

  return (
    <div className="offres-RH-page">
      <Navbar links={ManagerNavbarLinks(userId)} />
      <h2 className="title-offre-RH">Validation des Offres</h2>
      <MdOutlineContentPasteSearch className="icon-offre-RH" />
      <Filter
        filter={filter}
        setFilter={setFilter}
        handleClear={handleClearFilter}
      />
      <div className="stage-cards-RH">
        {filteredStageData.map((stage, index) => (
          <ManagerOfferCard key={index} {...stage} userId={userId} />
        ))}
      </div>
    </div>
  );
};

export default ManagerValidation;
