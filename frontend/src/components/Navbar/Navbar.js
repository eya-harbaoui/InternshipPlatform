// Navbar.js
import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { GrClose } from "react-icons/gr";
import { AiOutlineBars, AiOutlineLogout } from "react-icons/ai";
import logo from "./IMcoding.png";
import logo2 from "./TENOVARGroup.jpeg";
import "./Navbar.css";
import getUserIdFromLocalStorage from "../../UserAuth.js";

function Navbar({ links, page }) {
  const [clicked, setClicked] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // Hook pour la navigation
  const { role, userId } = getUserIdFromLocalStorage() || {};

  const handleClick = () => {
    setClicked(!clicked);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Supprimer le token du localStorage
    navigate("/"); // Rediriger vers la page d'accueil
  };

  return (
    <nav className="NavbarItems">
      <div className="entete">
        {/*<img src={logo} alt="logoImcoding" className="logoIMcoding" />*/}
        <img src={logo2} alt="tenovarGroup" className="logoIMcoding" />
        {/*<h2 className="navbar-logo">TENOVAR GROUP</h2>*/}
      </div>

      <div className="menu-icons" onClick={handleClick}>
        {clicked ? (
          <GrClose className="closed-icon"></GrClose>
        ) : (
          <AiOutlineBars className="closed-icon"></AiOutlineBars>
        )}
      </div>

      <ul className={clicked ? "nav-menu active" : "nav-menu"}>
        {links.map((item, index) => (
          <li key={index}>
            <Link
              to={item.url}
              className={location.pathname === item.url ? "active" : ""}
            >
              {item.title}
            </Link>
          </li>
        ))}
        <li>
          {page !== "acceuil" && userId && (
            <button className="logout-button" onClick={handleLogout}>
              <AiOutlineLogout className="icon-nav" />
              Logout
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
