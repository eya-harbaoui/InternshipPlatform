import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./signup.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordRetyped: "",
    phoneNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      firstName,
      lastName,
      email,
      password,
      passwordRetyped,
      phoneNumber,
    } = formData;

    if (password !== passwordRetyped) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (!password || !password.trim()) {
      toast.error("Veuillez entrer un mot de passe");
      return;
    }

    axios
      .post("http://localhost:8000/users", {
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
      })
      .then((response) => {
        if (response.data.error) {
          toast.error(response.data.error);
        } else {
          toast.success("Inscription réussie !");
          navigate("/login"); // Redirection vers la page de connexion
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="signup-container">
      <h2 className="heading-signup">Bienvenue ! Créer un nouveau compte</h2>
      <div className="signup-form-container">
        <div className="left-signup">
          <img className="img-signup" src="./images/SignUp.jpg" alt="signup" />
        </div>
        <form className="right-signup" onSubmit={handleSubmit}>
          <input
            className="input-signup-right"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Nom"
          />
          <input
            className="input-signup-right"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Prénom"
          />
          <input
            className="input-signup-right"
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Numéro de téléphone"
          />
          <div className="password-input-container">
            <input
              className="input-password-signup-right"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mot de passe"
            />
            {showPassword ? (
              <FaEye
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              />
            ) : (
              <FaEyeSlash
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              />
            )}
          </div>
          <div className="password-input-container">
            <input
              className="input-password-signup-right"
              type={showPassword ? "text" : "password"}
              name="passwordRetyped"
              value={formData.passwordRetyped}
              onChange={handleChange}
              placeholder="Mot de passe"
            />
            {showPassword ? (
              <FaEye
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              />
            ) : (
              <FaEyeSlash
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              />
            )}
          </div>

          <button className="btn-signup" onClick={handleSubmit}>
            S'inscrire
          </button>
          <p className="text-signup">
            Vous avez déjà un compte ? <Link to="/login">Connectez-vous</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
