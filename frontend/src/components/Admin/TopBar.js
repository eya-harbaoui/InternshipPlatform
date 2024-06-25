import {
  faBell,
  faCircleUser,
  faEnvelope,
} from "@fortawesome/free-regular-svg-icons";
import { faBars, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate } from "react-router-dom";
import React from "react";
import { AiOutlineBars, AiOutlineLogout } from "react-icons/ai";
import { Link } from "react-router-dom";
import getUserIdFromLocalStorage from "../../UserAuth.js";
import "../Navbar/Navbar.css";
function Topbar() {
  const { role, userId } = getUserIdFromLocalStorage() || {};
  const navigate = useNavigate(); // Hook pour la navigation

  const handleLogout = () => {
    localStorage.removeItem("token"); // Supprimer le token du localStorage
    navigate("/"); // Rediriger vers la page d'accueil
  };

  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
      {/* <!-- Sidebar Toggle (Topbar) --> */}
      <button
        id="sidebarToggleTop"
        className="btn btn-link d-md-none rounded-circle mr-3"
      >
        <FontAwesomeIcon icon={faBars} />
      </button>

      {/* <!-- Topbar Navbar --> */}
      <ul className="navbar-nav ml-auto">
        {/* <!-- Nav Item - Search Dropdown (Visible Only XS) --> */}
        <li className="nav-item dropdown no-arrow d-sm-none">
          <a
            className="nav-link dropdown-toggle"
            href="#"
            id="searchDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <FontAwesomeIcon icon={faSearch} />
          </a>
          {/* <!-- Dropdown - Messages --> */}
          <div
            className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
            aria-labelledby="searchDropdown"
          >
            <form className="form-inline mr-auto w-100 navbar-search">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control bg-light border-0 small"
                  placeholder="chercher..."
                  aria-label="Search"
                  aria-describedby="basic-addon2"
                />
                <div className="input-group-append">
                  <button className="btn btn-primary" type="button">
                    <i className="fas fa-search fa-sm"></i>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </li>

        {/* <!-- User Info and Logout --> */}
        {userId && (
          <li className="nav-item">
            <button className="logout-button" onClick={handleLogout}>
              <AiOutlineLogout className="icon-nav" />
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Topbar;
