import React, { useState } from "react";
import StageCard from "../../components/Card/StageCard";
import "./Offres.css";
import Navbar from "../../components/Navbar/Navbar";
import { Select, Button } from "antd";
import {
  domainOptions,
  durationOptions,
  modeOptions,
  natureOptions,
} from "./FilterOptions";
import {NavbarLinks} from "../../components/Navbar/NavbarLinks";
import { stageData } from "./stageData";
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
      <Navbar links={NavbarLinks} />
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
