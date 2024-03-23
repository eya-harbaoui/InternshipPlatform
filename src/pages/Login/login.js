import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./login.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Input from "../../components/Input/Input";
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
    <div className="container">
      <h2 className="heading">Bienvenue ! Connectez-vous pour continuer</h2>
      <div className="form_container">
        <div className="left">
          <img className="img" src="./images/Login.jpg" alt="login" />
        </div>
        <div className="right">
          <Input
            type="email"
            value={email}
            onChange={handleEmailChange}
            width="70%"
            height="35px"
            placeholder = "Adresse e-mail"
          />
          <Input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            width="70%"
            height="35px"
            password
            placeholder="mot de passe"
          />
          <button className="btn" type="submit" onSubmit={handleSubmit}>
            Se Connecter
          </button>
          <p className="text">ou</p>
          <button className="google_btn">
            <img src="./images/google.png" alt="google icon" />
            <span>Se Connecter avec Google</span>
          </button>
          <p className="text">
            Vous n'avez pas de compte ? <Link to="/signup">Inscrivez-vous</Link>
          </p>
          <p className="text">
            Mot de passe oubliée?{" "}
            <Link to="/reset">Réinitialiser votre mot de passe</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
