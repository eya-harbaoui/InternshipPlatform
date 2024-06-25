import React from "react";
import { Link } from "react-router-dom";
import {
  faFaceLaughWink,
  faTachographDigital,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUserShield } from "@fortawesome/free-solid-svg-icons";
import getUserIdFromLocalStorage from "../../UserAuth.js";

// Ajouter l'icône d'administrateur à la bibliothèque
library.add(faUserShield);
function Sidebar() {
  const { role, userId } = getUserIdFromLocalStorage() || {};

  return (
    <ul
      className="navbar-nav-1  sidebar sidebar-dark accordion"
      id="accordionSidebar"
    >
      {/* <!-- Sidebar - Brand --> */}
      <a
        className="sidebar-brand d-flex align-items-center justify-content-center"
        href="index.html"
      >
        <div className="sidebar-brand-icon rotate-n-15">
          <FontAwesomeIcon icon="user-shield" rotation={20} size="2x" />
        </div>
        <div className="sidebar-brand-text mx-3">Admin</div>
      </a>

      {/* <!-- Divider --> */}
      <hr className="sidebar-divider my-0" />

      {/* <!-- Nav Item - Dashboard --> */}
      <li className="nav-item active">
        <Link className="nav-link" to={`/Admin/dashboard/${userId}`}>
          <FontAwesomeIcon
            icon={faTachographDigital}
            style={{ marginRight: "0.5rem" }}
          />
          <span>Dashboard</span>
        </Link>
      </li>
      {/* <!-- Divider --> */}
      <hr className="sidebar-divider my-0" />

      {/* <!-- Nav Item - Users --> */}
      <li className="nav-item active">
        <Link className="nav-link" to={`/Admin/users/${userId}`}>
          <FontAwesomeIcon icon={faUsers} style={{ marginRight: "0.5rem" }} />
          <span>Utilisateurs</span>
        </Link>
      </li>
      <li className="nav-item active">
        <Link className="nav-link" to={`/Admin/Gestion_Des_Domaines/${userId}`}>
          <FontAwesomeIcon
            icon={faTachographDigital}
            style={{ marginRight: "0.5rem" }}
          />
          <span>Gestion des domaine de stages</span>
        </Link>
      </li>
      <li className="nav-item active">
        <Link
          className="nav-link"
          to={`/Admin/Gestion_Des_Compétences/${userId}`}
        >
          <FontAwesomeIcon
            icon={faTachographDigital}
            style={{ marginRight: "0.5rem" }}
          />
          <span>Gestion des Compétences</span>
        </Link>
      </li>
    </ul>
  );
}

export default Sidebar;
