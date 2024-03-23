import { Link, useNavigate } from "react-router-dom";
import "./signup.css";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Input from "../../components/Input/Input";
function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [numTel, setNumTel] = useState("");
  let validate = true;
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
    console.log(firstName, lastName, email, password,numTel);;
    e.preventDefault();
    if (!email || !password || !firstName || !lastName || !numTel) {
      toast.error("All fields must be filled out!");
      validate = false;
    } else {
      if (password.length < 6) {
        toast.warning("Short Password");
        validate = false;
      } else {
        if (password.search(/\d/) == -1) {
          toast.warning("Your password must contain alphanumeric characters!");
          validate = false;
        }
        if (password.search(/[a-zA-Z]/) == -1) {
          toast.warning("Your password must contain alphanumeric characters!");
          validate = false;
        }
        if (password.search(/[\!\@\#\$\%\^\&\*\(\)\_\+\.\,\;\:]/) == -1) {
          toast.warning("Your password must contain symbols!");
          validate = false;
        }
      }
    }
if (validate == true) {
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
    <div className="container">
      <h2 className="heading">Bienvenue ! Créer un nouveau compte</h2>
      <div className="form_container">
        <div className="left">
          <img className="img" src="./images/SignUp.jpg" alt="signup" />
        </div>
        <div className="right">
          <Input
            type="text"
            value={lastName}
            onChange={handleLastNameChange}
            width="70%"
            height="35px"
            placeholder="Nom"
          />
          <Input
            type="text"
            value={firstName}
            onChange={handleFirstNameChange}
            width="70%"
            height="35px"
            placeholder="Prénom"
          />
          <Input
            type="text"
            value={numTel}
            onChange={handleNumTelChange}
            width="70%"
            height="35px"
            placeholder="Numéro de téléphone"
          />
          <Input
            type="email"
            value={email}
            onChange={handleEmailChange}
            width="70%"
            height="35px"
            placeholder="Adresse e-mail"
          />
          <Input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            width="70%"
            height="35px"
            password
            placeholder="Mot de passe"
          />

          <button type="submit" className="btn" onSubmit={handleSubmit}>
            S'inscrire
          </button>
          <p className="text">or</p>
          <button className="google_btn">
            <img src="./images/google.png" alt="google icon" />
            <span>Sign up with Google</span>
          </button>
          <p className="text">
            Vous avez déjà un compte ?<Link to="/login">Connectez-vous</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
