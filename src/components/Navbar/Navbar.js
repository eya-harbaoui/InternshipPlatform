import "./Navbar.css";
import React, { useState } from "react";
import { AiOutlineBars } from "react-icons/ai";
import { GrClose } from "react-icons/gr";
import { CgProfile } from "react-icons/cg";
import { AiOutlineLogout } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";

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
      </ul>
    </nav>
  );
}

export default Navbar;
