import React from "react";
import NavButton from "./NavBarButtons/NavbarButtons";
import "./NavBar.css";
import { useNavigate } from "react-router-dom";
import { InputText } from "../Input/inputText";


export const NavBar = () => {
    const navigate = useNavigate();

    const handleNavigate = (path: string) => {
        navigate(path);
    }


    const handleInputSearch = async (value: string) => {
        try {
          const response = await fetch(`https://api.coingecko.com/api/v3/coins/list`);
          const data = await response.json();
      
          const coin = data.find((coin: any) => coin.id === value);
      
          if (coin) {
            
            console.log("נמצא מטבע:", coin);
          } else {
            console.log("לא נמצא מטבע עם המזהה:", value);
          }
        } catch (error) {
          console.error("שגיאה בביצוע הבקשה:", error);
        }
      };



    return (
        <>

        <div className="navContainer">
            <div className="navLogo">
                <span className="logoHeader">Crypto Live</span>
            </div>
            <div className="navButtons">
                <InputText handleOnChange={handleInputSearch} placeholder='Sarch' type='text' />
                

                <h4 onClick={() => handleNavigate('/Coins')}>Coins</h4>
                <h4 onClick={() => handleNavigate('/Reports')}>Reports</h4>
                <h4 onClick={() => handleNavigate('/About')}>About</h4>
            </div>

        </div >
        </>
    );
}

