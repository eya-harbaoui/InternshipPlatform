import React from "react";
import { Select, Button } from "antd";
import {
  domainOptions,
  durationOptions,
  modeOptions,
  natureOptions,
} from "./FilterOptions";

const { Option } = Select;

const Filter = ({ filter, setFilter, handleClear }) => {
  const handleFilterChange = (key, value) => {
    setFilter((prevState) => ({ ...prevState, [key]: value }));
  };

  return (
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
      <Button onClick={handleClear}>Effacer</Button>
    </div>
  );
};

export default Filter;
