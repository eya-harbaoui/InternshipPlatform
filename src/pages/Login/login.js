import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./login.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PasswordInput from "../../components/Input/PasswordInput";
import axios from "axios";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:5000/login-user",
        {
          email,
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
      .then((res) => {
        console.log(res.data, "userRegister");
        if (res.data.status === "ok") {
          toast.success("login successful");
          window.localStorage.setItem("token", res.data.data);
          window.localStorage.setItem("loggedIn", true);
          window.location.href = "./userDetails";
        } else {
          alert("wrong password");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="login-container">
      <h2 className="heading-login">
        Bienvenue ! Connectez-vous pour continuer
      </h2>
      <div className="login-form-container">
        <div className="login-left">
          <img className="login-img" src="./images/Login.jpg" alt="login" />
        </div>
        <div className="login-right">
          <input
            className="login-input-right"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Adresse e-mail"
          />
          <PasswordInput
            placeholder="Mot de passe"
            onChange={handlePasswordChange}
          />
          <button className="login-btn" type="submit" onSubmit={handleSubmit}>
            Se Connecter
          </button>
          <p className="login-text">
            Vous n'avez pas de compte ? <Link to="/signup">Inscrivez-vous</Link>
          </p>
          <p className="login-text">
            Mot de passe oubliée?{" "}
            <Link to="/reset">Réinitialiser votre mot de passe</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
