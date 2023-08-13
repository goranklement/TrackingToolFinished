import React from "react";
import Logo from "../assets/logo.png";
import "../main.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={Logo} alt="Devot Logo" />
        <h2 className="heading-navbar">Tracking tool</h2>
      </div>
    </nav>
  );
};

export default Navbar;
