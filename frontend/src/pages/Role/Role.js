import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import getUserIdFromLocalStorage from "../../UserAuth.js";
import "../Login/login.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Role() {
  const [roleSelected, setRoleSelected] = useState(""); // Ajout de l'état du rôle
  const navigate = useNavigate();
  const { role, userId } = getUserIdFromLocalStorage() || {};

  // Fonction pour gérer la navigation en fonction du rôle
  const handleRoleNavigation = () => {
    if (roleSelected === "Student") {
      navigate("/Offres");
      return;
    }

    if (!userId) {
      toast.error(
        "Vous n'êtes pas connecté. Veuillez vous connecter d'abord."
      );
      navigate("/login");
      return;
    }

    if (role !== roleSelected) {
      toast.error(
        "Vous n'êtes pas autorisé pour ce rôle. Veuillez vous connecter avec le bon rôle."
      );
      navigate("/login");
      return;
    }

    switch (roleSelected) {
      case "Admin":
        navigate(`/Admin/dashboard/${userId}`);
        break;
      case "Manager":
        navigate(`/Validation_des_offres/${userId}`);
        break;
      case "Assistant RH":
      case "Responsable RH":
        navigate(`/RH_Offres/${userId}`);
        break;
      case "Validator":
        navigate(`/Candidatures_Assignées/${userId}`);
        break;
      default:
        navigate("/role"); // Redirection par défaut
    }
  };

  return (
    <div className="login-container">
      <h2 className="heading-login">Bienvenue ! Quel est votre rôle ?</h2>
      <div className="login-form-container">
        <div className="login-left">
          <img className="login-img" src="./images/Login.jpg" alt="login" />{" "}
        </div>
        <div className="login-right">
          <select
            className="login-input-right"
            value={roleSelected}
            onChange={(e) => setRoleSelected(e.target.value)}
          >
            <option value="Choisir un rôle">Choisir un rôle</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Assistant RH">Assistant RH</option>
            <option value="Responsable RH">Responsable RH</option>
            <option value="Validator">Validator</option>
            <option value="Student">Student</option>
          </select>
          <button className="login-btn" onClick={handleRoleNavigation}>
            Se Connecter
          </button>
          <p className="login-text">
            Vous n'avez pas de compte ? <Link to="/signup">Inscrivez-vous</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Role;
