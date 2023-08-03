import React from "react";
import './inputText.css';

export interface InputTextProps {
  type: string;
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputText: React.FC<InputTextProps> = ({ type, placeholder, value, onChange }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        color: "black",
        width: "200px", // Increase the width to 200 pixels
        height: "40px", // Increase the height to 40 pixels
      }}
    />
  );
};

export default InputText;
