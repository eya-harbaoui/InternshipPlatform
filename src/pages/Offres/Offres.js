import React, { useState } from "react";
import StageCard from "../../components/Card/StageCard";
import "./Offres.css";
import Navbar from "../../components/Navbar/Navbar";
import { Input, Select, Button } from "antd";
import {
  domainOptions,
  durationOptions,
  modeOptions,
  natureOptions,
} from "./FilterOptions";

const stageData = [
  {
    stageTitle: "Stage en développement web",
    stageNature: "PFA",
    stageDescription:
      "Vous êtes passionné(e) par le développement web et vous souhaitez acquérir une expérience professionnelle dans ce domaine ? Rejoignez notre équipe pour un stage de 6 mois en développement web. Vous travaillerez sur des projets concrets et aurez l'opportunité de mettre en pratique vos compétences en programmation. Vous serez encadré(e) par des professionnels expérimentés et aurez l'occasion de participer à des formations et des ateliers.",
    domainTag: "Développement web",
    modeTag: "Hybride",
    durationTag: "4 mois",
    offerLink: "offre-de-stage-1",
  },
  {
    stageTitle: "Stage en marketing digital",
    stageNature: "PFE",
    stageDescription:
      "Vous êtes passionné(e) par le marketing digital et vous souhaitez acquérir une expérience professionnelle dans ce domaine ? Rejoignez notre équipe pour un stage de 6 mois en marketing digital. Vous travaillerez sur des projets concrets et aurez l'opportunité de mettre en pratique vos compétences en marketing. Vous serez encadré(e) par des professionnels expérimentés et aurez l'occasion de participer à des formations et des ateliers.",
    domainTag: "Marketing digital",
    modeTag: "Présentiel",
    durationTag: "6 mois",
    offerLink: "offre-de-stage-2",
  },
  {
    stageTitle: "Stage en design graphique",
    stageNature: "Initiation",
    stageDescription:
      "Vous êtes passionné(e) par le design graphique et vous souhaitez acquérir une expérience professionnelle dans ce domaine ? Rejoignez notre équipe pour un stage de 6 mois en design graphique. Vous travaillerez sur des projets concrets et aurez l'opportunité de mettre en pratique vos compétences en design. Vous serez encadré(e) par des professionnels expérimentés et aurez l'occasion de participer à des formations et des ateliers.",
    domainTag: "Design graphique",
    modeTag: "Remote",
    durationTag: "4 mois",
    offerLink: "offre-de-stage-3",
  },
];

const { Option } = Select;

const Offres = () => {
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

  const filteredStageData = stageData.filter((stage) => {
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
      <Navbar />
      <h1>Nos offres de stage</h1>
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
      <div className="stage-cards">
        {filteredStageData.map((stage, index) => (
          <StageCard key={index} {...stage} />
        ))}
      </div>
    </div>
  );
};

export default Offres;
