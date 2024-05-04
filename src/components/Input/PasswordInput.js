// PasswordInput.jsx
import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import "./PasswordInput.css"; // Ajoutez ce fichier CSS pour les styles du PasswordInput

const PasswordInput = ({ placeholder, value, onChange, className }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className={`input-password-div ${className}`}>
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className="password-input"
        value={value}
        onChange={handlePasswordChange}
      />
      {showPassword ? (
        <AiFillEye className="eye-icon" onClick={togglePasswordVisibility} />
      ) : (
        <AiFillEyeInvisible
          className="eye-icon"
          onClick={togglePasswordVisibility}
        />
      )}
    </div>
  );
};

export default PasswordInput;
