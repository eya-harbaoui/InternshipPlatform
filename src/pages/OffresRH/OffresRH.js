import React, { useState } from "react";
import OffresRHCard from "../../components/OffresRHCard/OffresRHCard.js";
import "./OffresRH.css";
import Navbar from "../../components/Navbar/Navbar";
import { Select, Button, Modal } from "antd";
import {
  domainOptions,
  durationOptions,
  modeOptions,
  natureOptions,
} from "../Offres/FilterOptions.js";
import { MdOutlineContentPasteSearch } from "react-icons/md";
import { NavbarLinks } from "../../components/Navbar/NavbarLinks";
import { RHOfferData } from "./RHOfferData.js";
const { Option } = Select;

const OffresRH = () => {
  const [filter, setFilter] = useState({
    searchTerm: "",
    domain: "",
    duration: "",
    mode: "",
    nature: "", // Changed from "stageNature" to "nature"
  });

  const handleFilterChange = (key, value) => {
    setFilter({ ...filter, [key]: value });
  };

  const filteredStageData = RHOfferData.filter((stage) => {
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="offres-RH-page">
      <Navbar links={NavbarLinks} />
      <h2 className="title-offre-RH">Gestion des offres</h2>
      <MdOutlineContentPasteSearch className="icon-offre-RH" />
      <div className="button-container">
        <button className="add-offer-button" onClick={showModal}>
          Ajouter une offre
        </button>
      </div>
      <div className="filter-container">
        <Select
          placeholder="Domaine de stage"
          value={filter.domain}
          onChange={(value) => handleFilterChange("domain", value)}
          style={{ width: 150, marginRight: 10 }}
        >
          {domainOptions.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Durée de stage"
          value={filter.duration}
          onChange={(value) => handleFilterChange("duration", value)}
          style={{ width: 150, marginRight: 10 }}
        >
          {durationOptions.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Mode de stage"
          value={filter.mode}
          onChange={(value) => handleFilterChange("mode", value)}
          style={{ width: 150, marginRight: 10 }}
        >
          {modeOptions.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Nature de stage"
          value={filter.nature}
          onChange={(value) => handleFilterChange("nature", value)}
          style={{ width: 150, marginRight: 10 }}
        >
          {natureOptions.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
        <Button
          onClick={() =>
            setFilter({
              searchTerm: "",
              domain: "",
              duration: "",
              mode: "",
              nature: "",
            })
          }
        >
          Effacer
        </Button>
      </div>
      <div className="stage-cards-RH">
        {filteredStageData.map((stage, index) => (
          <OffresRHCard key={index} {...stage} />
        ))}
      </div>
      {isModalOpen && (
        <Modal
          title="Ajouter une offre de stage"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <div className="modal-content">
            <h3>Remplir les informations de l'offre</h3>
            <input
              type="text"
              placeholder="Titre de stage"
              className="modal-input"
            />
            <Select
              placeholder="Domaine de stage"
              className="modal-input"
              style={{ width: "100%" }}
            >
              {domainOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="Nature de stage"
              className="modal-input"
              style={{ width: "100%" }}
            >
              {natureOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="Mode de stage"
              className="modal-input"
              style={{ width: "100%" }}
            >
              {modeOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="Durée de stage"
              className="modal-input"
              style={{ width: "100%" }}
            >
              {durationOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
            <div className="competences-container">
              <h3>Compétences demandées :</h3>
              <div className="competence-input">
                <span>HTML</span>
                <Select defaultValue="Intermédiaire">
                  <Option value="Débutant">Débutant</Option>
                  <Option value="Intermédiaire">Intermédiaire</Option>
                  <Option value="Avancé">Avancé</Option>
                </Select>
              </div>
              <div className="competence-input">
                <span>CSS</span>
                <Select defaultValue="Débutant">
                  <Option value="Débutant">Débutant</Option>
                  <Option value="Intermédiaire">Intermédiaire</Option>
                  <Option value="Avancé">Avancé</Option>
                </Select>
              </div>
              <div className="competence-input">
                <span>JavaScript</span>
                <Select defaultValue="Avancé">
                  <Option value="Débutant">Débutant</Option>
                  <Option value="Intermédiaire">Intermédiaire</Option>
                  <Option value="Avancé">Avancé</Option>
                </Select>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OffresRH;
