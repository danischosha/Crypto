import React from "react";

interface MainButtonProps {
  title: string;
  handleOnclick: () => void;
  icon?: React.ReactNode;
  style?: React.CSSProperties; // Add the style prop
}

export const MainButton = ({ title, handleOnclick, style }: MainButtonProps) => {
  return (
    <button
      onClick={handleOnclick}
      className="mainButton"
      style={{
        color: "black",
        
      }}
    >
      {title}
    </button>
  );
};
