import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Ajouter navigate
import "./login.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { jwtDecode } from "jwt-decode"; // Changer l'import de jwt-decode

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:8000/users/login", {
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);

      // Décodage du token pour récupérer les informations utilisateur
      const decodedToken = jwtDecode(token); // Utilisation de jwtDecode
      console.log(decodedToken);
      const { role, userId } = decodedToken;

      console.log(role, "role");

      toast.success("Connexion réussie !");

      // Redirection en fonction du rôle de l'utilisateur
      switch (role) {
        case "Admin":
          navigate(`/Admin/dashboard/${userId}`);
          break;
        case "Manager":
          navigate(`/Validation_des_offres/${userId}`);
          break;
        case "Assistant RH":
          navigate(`/RH_Offres/${userId}`);
          break;

        case "Responsable RH":
          navigate(`/RH_Offres/${userId}`);
          break;
        case "Validator":
          navigate(`/Candidatures_Assignées/${userId}`);
          break;
        case "Student":
          navigate("/Offres");
          break;
        default:
          navigate("/"); // Redirection par défaut
      }
    } catch (error) {
      toast.error("Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="login-container">
      <h2 className="heading-login">
        Bienvenue ! Connectez-vous pour continuer
      </h2>
      <div className="login-form-container">
        <div className="login-left">
          <img className="login-img" src="./images/Login.jpg" alt="login" />{" "}
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
              type="password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="Mot de passe"
            />
          </div>

          <button className="login-btn" onClick={handleSubmit}>
            Se Connecter
          </button>

          {/*<p className="login-text">
            Vous n'avez pas de compte ? <Link to="/signup">Inscrivez-vous</Link>
          </p>
          <p className="login-text">
            Mot de passe oublié ?{" "}
            <Link to="/reset">Réinitialiser votre mot de passe</Link>
          </p>*/}
        </div>
      </div>
    </div>
  );
}

export default Login;
