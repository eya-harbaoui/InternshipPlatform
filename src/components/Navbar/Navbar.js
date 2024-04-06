// Navbar.js
import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { GrClose } from "react-icons/gr";
import { AiOutlineBars, AiOutlineLogout } from "react-icons/ai";
import "./Navbar.css";
function Navbar({ links }) {
  const [clicked, setClicked] = useState(false);
  const location = useLocation();

  const handleClick = () => {
    setClicked(!clicked);
  };

  return (
    <nav className="NavbarItems">
      <h2 className="navbar-logo">Internship App</h2>

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
          <button className="logout-button">
            <AiOutlineLogout className="icon-nav" />
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
