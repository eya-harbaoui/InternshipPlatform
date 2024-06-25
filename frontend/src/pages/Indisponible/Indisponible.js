import React from "react";
import { NavbarLinks } from "../../components/Navbar/NavbarLinks";
import getUserIdFromLocalStorage from "../../UserAuth.js";
import Navbar from "../../components/Navbar/Navbar";
import imageIndispo from "./Indispo.jpg";
import "./Indisponible.css";
function Indisponible() {
  return (
    <div className="candidatures-page">
      <Navbar links={NavbarLinks()} />
      <h2 className="title-candidature">
        Ooops ! Cette offre n'est plus disponible.
      </h2>
      <img src={imageIndispo} alt="indispo" className="imageIndispo" />
    </div>
  );
}

export default Indisponible;
