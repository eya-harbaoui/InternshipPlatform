//import
import React, { useState, useEffect } from "react";
import ManagerOfferCard from "../../components/ManagerOfferCard/ManagerOfferCard.js";
import "./ManagerValidation.css";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import { Select, Modal } from "antd";
import {
  durationOptions,
  modeOptions,
  natureOptions,
} from "../../components/Filter/FilterOptions.js";
import Filter from "../../components/Filter/Filter";
import { MdOutlineContentPasteSearch } from "react-icons/md";
import { RHNavbarLinks } from "../../components/Navbar/RHNavbarLinks";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
const { Option } = Select;

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
  const [domainOptions, setDomainOptions] = useState([]);
  const [domains, setDomains] = useState([]);
  const [offer, setOffer] = useState({
    stageTitle: "",
    stageNature: "",
    stageDescription: "",
    domainTag: "",
    modeTag: "",
    durationTag: "",
    publicationDate: "",
    OfferStatus: "brouillon",
    competences: [],
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

  const fetchDomains = async () => {
    try {
      const response = await axios.get("http://localhost:8000/Domaines");
      if (response.data) {
        console.log("responseeee", response.data);
        setDomains(response.data);
        const domains = response.data.map((domain) => ({
          value: domain.domainName,
          label: domain.domainName,
        }));
        setDomainOptions([
          { value: "", label: "Tous les domaines" },
          ...domains,
        ]);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations de profil :",
        error
      );
    }
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
      const response = await axios.get("http://localhost:8000/offers");
      const sortedData = response.data.sort((a, b) => {
        return new Date(b.publicationDate) - new Date(a.publicationDate);
      });
      setData(sortedData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const sendOffer = async () => {
    try {
      const id = uuidv4(); // Generate unique ID
      const offerWithIdAndLink = {
        ...offer,
        id: id,
        offerLink: `offre-de-stage-${id}`,
      };
      const response = await axios.post(
        "http://localhost:8000/offers",
        offerWithIdAndLink
      );
      console.log("Offre ajoutée avec succès:", response.data);
      toast.success("Offre ajoutée avec succès !");
      setIsModalOpen(false);
      setOffer({
        stageTitle: "",
        stageNature: "",
        stageDescription: "",
        domainTag: "",
        modeTag: "",
        durationTag: "",
        competences: [],
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'offre:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDomains();
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    sendOffer();
  };
  
  const handleCancel = () => {
    setIsModalOpen(false);
    setOffer({
      stageTitle: "",
      stageNature: "",
      stageDescription: "",
      domainTag: "",
      modeTag: "",
      durationTag: "",
      competences: [],
    });
  };

  return (
    <div className="offres-RH-page">
      <Navbar links={RHNavbarLinks} />
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
