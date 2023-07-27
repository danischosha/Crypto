import React from "react";
import { TextField } from '@mui/material'
import './inputText.css'




interface InputTextProps{
    type: string;
    placeholder: string;
    handleOnChange: (value: string) => void;
}

export const InputText = ({ type, placeholder, handleOnChange }: InputTextProps) => {
    return <TextField onChange={
        (e: React.ChangeEvent<HTMLInputElement>) => handleOnChange(e.target.value)}
        className='inputText' type={type}
  
        placeholder={placeholder} />
}