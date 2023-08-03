import React from "react";

interface MainButtonProps {
  title: string;
  handleOnclick: () => void;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string; // Add the className prop
}

export const MainButton = ({ title, handleOnclick, style, className }: MainButtonProps) => {
  return (
    <button
      onClick={handleOnclick}
      className={`mainButton ${className}`} // Add className to the button
  
    >
      {title}
    </button>
  );
};
