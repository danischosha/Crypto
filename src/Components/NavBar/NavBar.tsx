import React from "react";
import "./NavBar.css";
import { useNavigate } from "react-router-dom";

export const NavBar = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <div className="navContainer">
        <div className="navLogo">
          <span className="logoHeader">Crypto Live</span>
        </div>
        <div className="navButtons">
          <h4 onClick={() => handleNavigate('/Coins')}>Coins</h4>
          <h4 onClick={() => handleNavigate('/About')}>About</h4>
          <h4 onClick={() => handleNavigate('/Reports')}>Reports</h4>
        </div>
      </div>
    </>
  );
};
