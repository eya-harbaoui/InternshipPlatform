import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./login.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);


  const handleEmailChange = (e) => {
    setEmail(e.target.value);
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
         <div className="password-input-container">
           <input
             className="input-password-signup-right"
             type={showPassword ? "text" : "password"}
             name="password"
             value={password}
             onChange={(e)=>{setPassword(e.target.value)}}
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
