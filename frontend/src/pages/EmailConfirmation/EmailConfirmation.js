import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Ajouter navigate
import "./EmailConfirmation.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function EmailConfirmation() {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleConfirmationCodeChange = (e) => {
    setConfirmationCode(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      console.log("confirmationCode", confirmationCode);
      const response = await axios.post(
        "http://localhost:8000/students/confirm_email",
        {
          email,
          confirmationCode,
        }
      );

      toast.success("Email confirmé avec succès bienvenue !");
      navigate("/login");
    } catch (error) {
      toast.error("Code incorrecte ! ");
    }
  };

  return (
    <div className="login-container">
      <h2 className="heading-login">
        Confirmer votre Email !Tapez le code de confirmation que vous avez reçu
        par email.
      </h2>
      <div className="login-form-container">
        <div className="login-left">
          <img className="login-img" src="./images/Login.jpg" alt="login" />{" "}
        </div>
        <div className="login-right">
          <input
            className="input-signup-etudiant-right"
            type="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Adresse Email"
          />
          <input
            className="login-input-right"
            type="text"
            value={confirmationCode}
            onChange={handleConfirmationCodeChange}
            placeholder="Code de confirmation"
          />

          <button className="login-btn" onClick={handleSubmit}>
            Confirmer votre email
          </button>

          {/*<p className="login-text">
            Mot de passe oublié ?{" "}
            <Link to="/reset">Réinitialiser votre mot de passe</Link>
          </p>*/}
        </div>
      </div>
    </div>
  );
}

export default EmailConfirmation;
