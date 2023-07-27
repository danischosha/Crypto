import React from "react";


interface MainButtonProps{
    title: string;
    handleOnclick: ()=> void;
}


export const MainButton = ({title,handleOnclick }: MainButtonProps)=>{
    return <button onClick={handleOnclick} className="mainButton">{title}</button>
}