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

  const handlePasswordChange = (value) => {
    setPassword(value);
  };

 const handleSubmit = (e) => {
   e.preventDefault();
   axios
     .get("http://localhost:8000/user")
     .then((res) => {
       const users = res.data;
       const user = users.find(
         (u) => u.email === email && u.password === password
       );
       if (user) {
         localStorage.setItem("isSignedIn", true);
         window.location.href = "/Offres"; // Redirection vers la page Offres
       } else {
         toast.error("Email ou mot de passe incorrect");
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
           name="password"
           placeholder="Mot de passe"
           value={password}
           onChange={handlePasswordChange}
         />
         <button className="login-btn" type="submit" onClick={handleSubmit}>
           Se Connecter
         </button>
         <p className="login-text">
           Vous n'avez pas de compte ? <Link to="/signup">Inscrivez-vous</Link>
         </p>
         <p className="login-text">
           Mot de passe oublié ?{" "}
           <Link to="/reset">Réinitialiser votre mot de passe</Link>
         </p>
       </div>
     </div>
   </div>
 );
}

export default Login;
