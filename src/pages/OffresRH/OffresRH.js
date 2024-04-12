import React, { useState } from "react";
import OffresRHCard from "../../components/OffresCard/OffresRHCard.js";
import "./OffresRH.css";
import Navbar from "../../components/Navbar/Navbar";
import { Select, Button, Modal } from "antd";
import {
  domainOptions,
  durationOptions,
  modeOptions,
  natureOptions,
} from "../../components/Filter/FilterOptions.js";
import Filter from "../../components/Filter/Filter";
import { MdOutlineContentPasteSearch } from "react-icons/md";
import { RHNavbarLinks } from "../../components/Navbar/RHNavbarLinks";
import { RHOfferData } from "./RHOfferData.js";
const { Option } = Select;

const OffresRH = () => {
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
  const competenceOptions = [
    { value: "HTML", label: "HTML" },
    { value: "CSS", label: "CSS" },
    { value: "JavaScript", label: "JavaScript" },
  ];

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

  const [competences, setCompetences] = useState([]);
  const [niveauCompetence, setNiveauCompetence] = useState({});

  const handleCompetenceChange = (competence, niveau) => {
    setCompetences([...competences, competence]);
    setNiveauCompetence({ ...niveauCompetence, [competence]: niveau });
  };

  return (
    <div className="offres-RH-page">
      <Navbar links={RHNavbarLinks} />
      <h2 className="title-offre-RH">Gestion des offres</h2>
      <MdOutlineContentPasteSearch className="icon-offre-RH" />
      <div className="button-container">
        <button className="add-offer-button" onClick={showModal}>
          Ajouter une offre
        </button>
      </div>
      <Filter
        filter={filter}
        setFilter={setFilter}
        handleClear={handleClearFilter}
      />
      <div className="stage-cards-RH">
        {filteredStageData.map((stage, index) => (
          <OffresRHCard key={index} {...stage} />
        ))}
      </div>
      {isModalOpen && (
        <Modal
          title="Ajouter une offre de stage"
          visible={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <div className="modal-content">
            <h3>Remplir les informations de l'offre</h3>
            <input
              type="text"
              placeholder="Titre de stage"
              className="input-text-design"
            />
            <textarea
              type="text"
              placeholder="description de stage"
              className="textarea-design"
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
              {competences.map((competence) => (
                <div key={competence} className="competence-input">
                  <span>{competence}</span>
                  <Select
                    className="modal-input"
                    defaultValue={niveauCompetence[competence]}
                    onChange={(value) =>
                      setNiveauCompetence({
                        ...niveauCompetence,
                        [competence]: value,
                      })
                    }
                  >
                    <Option value="Débutant">Débutant</Option>
                    <Option value="Intermédiaire">Intermédiaire</Option>
                    <Option value="Avancé">Avancé</Option>
                  </Select>
                </div>
              ))}
              <Select
                className="modal-input"
                placeholder="Ajouter une compétence"
                style={{ width: "100%" }}
                onChange={(value) => handleCompetenceChange(value, "Débutant")}
              >
                {competenceOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OffresRH;
