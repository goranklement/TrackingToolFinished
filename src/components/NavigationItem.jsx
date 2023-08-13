import React from "react";
import "../main.css";
import { NavLink } from "react-router-dom";

import "primeicons/primeicons.css";

const NavigationItem = ({ icon, text, color, hasBorder, onClick }) => {
  const textLow = text.toLowerCase();
  const logoff = () => {
    if (onClick) {
      onClick();
    }
  };

  const navLinkStyles = ({ isActive }) => {
    if (hasBorder) {
      return {
        color: isActive ? "#F9F9FD" : "#C4C5D7",
        borderBottomWidth: "5px",
        borderBottomStyle: "solid",
        borderBottomColor: isActive ? "#FF5722" : `${color}`,
        borderWidth: "100%",
      };
    } else {
      return {};
    }
  };

  return (
    <NavLink
      to={textLow !== "logoff" ? `/${textLow}` : `/login`}
      style={navLinkStyles}
      className="nav-item"
      onClick={logoff}
    >
      <div className="group">
        <i className={`pi pi-${icon} `} style={{ fontSize: "18px" }}></i>
        <h2 className="navitem-heading">{text}</h2>
      </div>
    </NavLink>
  );
};

export default NavigationItem;
