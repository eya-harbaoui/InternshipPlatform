import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SignupEtudiant.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaTrash, FaUpload } from "react-icons/fa";

const SignupEtudiant = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showRetypedPassword, setShowRetypedPassword] = useState(false);
  const [role, setRole] = useState("Student");
  const [fileInputKey, setFileInputKey] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordRetyped: "",
    phoneNumber: "",
    establishment: "",
    address: "",
    studyLevel: "",
    cv: null,
    recommendationLetter: "",
    role: role,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  //Récupératon de CV

  const handleFileChange = (e) => {
    console.log(e.target.files);
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        cv: file,
      }));
      setSelectedFileName(file.name);
    } else {
      toast.error("Veuillez télécharger un fichier PDF");
    }
  };

  //Suppression de CV

  const handleDeleteFile = () => {
    // Supprimer le fichier en mettant à jour l'état formData
    setFormData({
      ...formData,
      cv: null,
    });
    // Réinitialiser le nom du fichier sélectionné
    setSelectedFileName("");
  };

  const handleSubmit = () => {
    const {
      firstName,
      lastName,
      password,
      passwordRetyped,
      establishment,
      address,
      studyLevel,
      cv,
      recommendationLetter,
      phoneNumber,
      role,
      email,
    } = formData;
    console.log(formData);

    // Vérifier si tous les champs sont remplis
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !passwordRetyped ||
      !phoneNumber ||
      !recommendationLetter ||
      !address ||
      cv === null ||
      !studyLevel ||
      !establishment
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
      .post(
        "http://localhost:8000/students/register",
        {
          firstName,
          lastName,
          password,
          establishment,
          address,
          studyLevel,
          cv,
          recommendationLetter,
          phoneNumber,
          role,
          email,
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((response) => {
        if (response.data.error) {
          toast.error(response.data.error);
        } else {
          toast.success("Inscription réussie !");
          navigate("/confirm_email"); // Redirection vers la page de connexion
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error(error);
      });
  };

  return (
    <div className="signup-etudiant-container">
      <h2 className="heading-signup-etudiant">
        Bienvenue ! Créer un nouveau compte
      </h2>
      <div className="signup-etudiant-form-container">
        <div className="left-signup-etudiant">
          <img
            className="img-signup-etudiant"
            src="./images/SignUp.jpg"
            alt="signup"
          />
        </div>
        <div className="right-signup-etudiant">
          <div className="student-form-row">
            <input
              className="input-signup-etudiant-right"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Nom"
            />
            <input
              className="input-signup-etudiant-right"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Prénom"
            />
          </div>
          <div className="student-form-row">
            <input
              className="input-signup-etudiant-right"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Adresse Email"
            />

            <input
              className="input-signup-etudiant-right"
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Numéro de téléphone"
            />
          </div>
          <div className="student-form-row">
            <div className="password-input-etudiant-container">
              <input
                className="input-password-signup-etudiant-right"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mot de passe"
              />
            </div>
            <div className="password-input-container-etudiant">
              <input
                className="input-password-signup-right"
                type="password"
                name="passwordRetyped"
                value={formData.passwordRetyped}
                onChange={handleChange}
                placeholder="Retapez le mot de passe"
              />
            </div>
          </div>
          <div className="student-form-row">
            <input
              className="input-signup-etudiant-right"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Adresse postale"
            />
            <input
              className="input-signup-etudiant-right"
              type="text"
              name="establishment"
              value={formData.establishment}
              onChange={handleChange}
              placeholder="Etablissement"
            />
          </div>
          <div className="student-form-row">
            <input
              className="input-signup-etudiant-right"
              type="text"
              name="studyLevel"
              value={formData.studyLevel}
              onChange={handleChange}
              placeholder="Niveau d'études"
            />
            {!formData.cv ? (
              <>
                <button
                  className="CV-button-etudiant"
                  type="button"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <FaUpload /> Ajouter votre CV (PDF)
                </button>
                <input
                  id="fileInput"
                  key={fileInputKey}
                  type="file"
                  accept="application/pdf"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </>
            ) : (
              <>
                <button className="CV-button-etudiant" type="button">
                  <span onClick={handleDeleteFile}>
                    <FaTrash style={{ color: "red" }} />
                    <a>{selectedFileName}</a>
                  </span>
                </button>
              </>
            )}
          </div>
          <div className="student-form-row">
            <textarea
              name="recommendationLetter"
              placeholder="Lettre de recommendation"
              value={formData.recommendationLetter}
              onChange={handleChange}
              required
              style={{ height: "200px" }}
              className="cover-letter-etudiant"
            />
          </div>

          <button className="btn-signup-etudiant" onClick={handleSubmit}>
            S'inscrire
          </button>
          <p className="text-signup-etudiant">
            Vous avez déjà un compte ?{" "}
            <Link to="/login_student">Connectez-vous</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupEtudiant;
