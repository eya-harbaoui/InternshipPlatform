import { Link } from "react-router-dom";
import "./signup.css";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PasswordInput from "../../components/Input/PasswordInput";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [numTel, setNumTel] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleNumTelChange = (e) => {
    setNumTel(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || !firstName || !lastName || !numTel) {
      toast.error("All fields must be filled out!");
    } else if (password.length < 6) {
      toast.warning("Short Password");
    } else if (
      password.search(/\d/) === -1 ||
      password.search(/[a-zA-Z]/) === -1 ||
      password.search(/[!@#$%^&*()_+.,;:]/) === -1
    ) {
      toast.warning(
        "Your password must contain alphanumeric characters and symbols!"
      );
    } else {
      axios
        .post(
          "http://localhost:5000/register",
          {
            firstName,
            lastName,
            email,
            numTel,
            password,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        )
        .then((response) => {
          if (response.data.error) {
            toast.error(response.data.error);
          } else {
            toast.success("Registration successful!");
            window.location = "/login";
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <div className="signup-container">
      <h2 className="heading-signup">Bienvenue ! Créer un nouveau compte</h2>
      <div className="signup-form-container">
        <div className="left-signup">
          <img className="img-signup" src="./images/SignUp.jpg" alt="signup" />
        </div>
        <div className="right-signup">
          <input
            className="input-signup-right "
            type="text"
            value={lastName}
            onChange={handleLastNameChange}
            placeholder="Nom"
          />
          <input
            className="input-signup-right "
            type="text"
            value={firstName}
            onChange={handleFirstNameChange}
            placeholder="Prénom"
          />
          <input
            className="input-signup-right "
            type="text"
            value={numTel}
            onChange={handleNumTelChange}
            placeholder="Numéro de téléphone"
          />
          <input
            className="input-signup-right "
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Adresse e-mail"
          />
          <PasswordInput
            placeholder="Mot de passe"
            onChange={handlePasswordChange}
          />
          <PasswordInput
            placeholder="Re-tapez Mot de passe"
            onChange={handlePasswordChange}
          />
          <button type="submit" className="btn-signup" onClick={handleSubmit}>
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
