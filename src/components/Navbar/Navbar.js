import "./Navbar.css";
import React from "react";
import { useState } from "react";
import { FaHome } from "react-icons/fa";
import { MdSlowMotionVideo } from "react-icons/md";
import { FiUserPlus } from "react-icons/fi";
import { BiLogIn } from "react-icons/bi";
import { AiOutlineBars } from "react-icons/ai";
import { MdWork } from "react-icons/md";
import { GrClose } from "react-icons/gr";
import { BsRobot } from "react-icons/bs";
import { NavbarLinks } from "./NavbarLinks";
import { CgProfile } from "react-icons/cg";
import { AiOutlineLogout } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
function Navbar() {
  //if we click on our toggle icon we will show the navbar links for screens size less then
  //850px
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();
  const handleClick = () => {
    setClicked(!clicked);
  };
  const handleLogout = () => {
    window.localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="NavbarItems">
      <MdWork className="robot-icon"></MdWork>
      <h2 className="navbar-logo">Nom Platforme</h2>

      <div className="menu-icons" onClick={handleClick}>
        {clicked ? (
          <GrClose className="closed-icon"></GrClose>
        ) : (
          <AiOutlineBars className="closed-icon"></AiOutlineBars>
        )}
      </div>

      <ul className={clicked ? "nav-menu active" : "nav-menu"}>
        {NavbarLinks.map((item, index) => {
          //display icons according to their names in menuLinks list
          const IconComponent =
            item.icon === "AiOutlineLogout"
              ? AiOutlineLogout
              : item.icon === "CgProfile"
              ? CgProfile
              : null;
          // Render logout button separately
          if (item.icon === "AiOutlineLogout") {
            return (
              <li key={index}>
                <Link className={item.cName} onClick={handleLogout} to="/">
                  {IconComponent && <IconComponent className="icon-nav" />}
                  {item.title}
                </Link>
              </li>
            );
          }
          return (
            <li key={index}>
              <Link to={item.url} className={item.cName}>
                {IconComponent && <IconComponent className="icon-nav" />}
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default Navbar;
