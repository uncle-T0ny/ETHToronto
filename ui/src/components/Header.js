import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Button from "react-bootstrap/Button";
import "./Header.css";
import {walletAPI} from "../WalletApi";

function Header() {
  const [click, setClick] = useState(false);
  const [isLoggedIn, setLogin] = useState(false);
  const handleClick = () => setClick(!click);
  const handleLogin = () => {
    if (walletAPI.isSignedIn()) {
      walletAPI.signOut();
      window.location.reload();
    } else {
      walletAPI.requestSignIn().then(r => {
        setLogin(true);
        console.log("LogIn response", r);
      })
    }

  };
  return (
    <div>
      <nav className="navbar navbar-dark navbar-expand-lg fixed-top bg-white portfolio-navbar gradient">
        <div className="nav-container">
          <NavLink to="/" className="nav-logo">
            MEL'S META
          </NavLink>

          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <NavLink to="/" className="nav-links" onClick={handleClick}>
                See All Volunteer Projects
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about/" className="nav-links" onClick={handleClick}>
                Upload Your Volunteering Organization
              </NavLink>
            </li>
          </ul>
          <div className="nav-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : "fas fa-bars"} />
          </div>

          <Button style={{marginRight: '20px'}} variant="light" onClick={handleLogin}>
            {walletAPI.isSignedIn() ? "Logout" : "Near Login"}
          </Button>
        </div>
      </nav>
    </div>
  );
}

export default Header;
