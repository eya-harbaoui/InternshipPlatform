import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaFileUpload } from "react-icons/fa";
import "./Input.css";

const Input = ({ type, password, width, height, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggle = () => {
    if (password) {
      setShowPassword(!showPassword);
    }
  };

  return (
    <div className="input-container" style={{ width: width, height: height }}>
      {type === "file" ? (
        <>
          <input type="file" {...props} className="input" />
          <button className="file-button">
            <FaFileUpload />
          </button>
        </>
      ) : (
        <>
          <input
            className="input"
            type={password ? (showPassword ? "text" : "password") : type}
            {...props}
          />
          {password && (
            <button className="password-toggle-button" onClick={handleToggle}>
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Input;
