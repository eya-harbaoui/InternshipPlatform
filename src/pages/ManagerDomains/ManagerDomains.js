//import
import React, { useState, useEffect } from "react";
import "./ManagerDomains.css";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import { MdOutlineContentPasteSearch } from "react-icons/md";
import { ManagerNavbarLinks } from "../../components/Navbar/ManagerNavbarLinks";
import DomainCard from "../../components/DomainCard/DomainCard";

const ManagerDomains = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/Domaines");

      setData(response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  });

  return (
    <div className="domaines-Manager-page">
      <Navbar links={ManagerNavbarLinks} />

      <h2 className="title-Manager-page">Gestion des domaines</h2>
      <MdOutlineContentPasteSearch className="icon-Manager-page" />

      {data.map((domaine, index) => (
        <DomainCard key={index} {...domaine} />
      ))}
    </div>
  );
};

export default ManagerDomains;
