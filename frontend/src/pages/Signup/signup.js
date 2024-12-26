import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./signup.css";
import signupImage from "./SignUp.jpg";

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
  const [showRetypedPassword, setShowRetypedPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const {
      firstName,
      lastName,
      email,
      password,
      passwordRetyped,
      phoneNumber,
    } = formData;

    // Vérifier si tous les champs sont remplis
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !passwordRetyped ||
      !phoneNumber
    ) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    // Vérifier si le mot de passe a une longueur minimale de 6 caractères et contient au moins une lettre, un chiffre et un caractère spécial
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    if (!password.match(passwordRegex)) {
      toast.error(
        "Le mot de passe doit avoir au moins 6 caractères avec des lettres, des chiffres et un caractère spécial"
      );
      return;
    }

    if (password !== passwordRetyped) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    // Envoi de la requête
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
        toast.error(error);
      });
  };

  return (
    <div className="signup-container">
      <h2 className="heading-signup">Bienvenue ! Créer un nouveau compte</h2>
      <div className="signup-form-container">
        <div className="left-signup">
          <img className="img-signup" src={signupImage} alt="signup" />
        </div>
        <div className="right-signup">
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
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Adresse Email"
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
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mot de passe"
            />
          </div>
          <div className="password-input-container">
            <input
              className="input-password-signup-right"
              type="password"
              name="passwordRetyped"
              value={formData.passwordRetyped}
              onChange={handleChange}
              placeholder="Retapez le mot de passe"
            />
          </div>

          <button className="btn-signup" onClick={handleSubmit}>
            S'inscrire
          </button>
          <p className="text-signup">
            Vous avez déjà un compte ? <Link to="/login">Connectez-vous</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
