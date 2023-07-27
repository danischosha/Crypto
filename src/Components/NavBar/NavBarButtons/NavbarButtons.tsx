import React from "react";
import "./NavbarButtons.css";


interface NavbarButtonsProps{
    text: string;
}


const NavButton = ({text}:NavbarButtonsProps ) => {
    return <button className="button">{text}</button>
}

export default NavButton