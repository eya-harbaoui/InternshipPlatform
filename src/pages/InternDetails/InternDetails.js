import React, { useState } from "react";
import { FaUserEdit, FaTrash, FaUpload } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { NavbarLinks } from "../../components/Navbar/NavbarLinks";
import "./InternDetails.css";

const InternDetails = () => {
  const [userName, setUserName] = useState("Eya");
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phoneNumber: "",
    email: "",
    levelOfStudy: "",
    institution: "",
    address: "",
    city: "",
    postalCode: "",
    cvFile: null,
    coverLetter: "",
  });
  const [fileInputKey, setFileInputKey] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, cvFile: e.target.files[0] });
  };

  const handleDeleteFile = () => {
    setFormData({ ...formData, cvFile: null });
    setFileInputKey(Date.now()); // Pour forcer le re-render de l'input file
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ajouter la logique pour soumettre le formulaire
  };

  return (
    <div className="intern-details">
      <Navbar links={NavbarLinks} />
      <div className="centered-container-user-intern">
        <h2 className="title-user-intern">Bonjour {userName}!</h2>
        <FaUserEdit className="icon-user-intern" />
        <p>
          Je renseigne mon identité et mes paramètres de connexion (Tous les
          champs sont obligatoires)
        </p>
      </div>
      <form className="form-intern-details" onSubmit={handleSubmit}>
        <div className="form-row-inter-details">
          <input
            type="text"
            name="name"
            placeholder="Nom"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="surname"
            placeholder="Prénom"
            value={formData.surname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Numéro de téléphone"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Adresse email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <input
            type="text"
            name="levelOfStudy"
            placeholder="Niveau d'étude"
            value={formData.levelOfStudy}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="institution"
            placeholder="Établissement"
            value={formData.institution}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <input
            type="text"
            name="address"
            placeholder="Adresse postale"
            value={formData.address}
            onChange={handleChange}
            required
          />
          {!formData.cvFile ? (
            <>
              <button
                className="CV-button"
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
            <button
              className="CV-button"
              type="button"
              onClick={handleDeleteFile}
            >
              <FaTrash /> {formData.cvFile.name}
            </button>
          )}
        </div>
        <div className="form-row">
          <textarea
            name="coverLetter"
            placeholder="Lettre de motivation"
            value={formData.coverLetter}
            onChange={handleChange}
            required
            style={{ height: "200px" }}
            className="cover-letter"
          />
        </div>
        <div className="form-row">
          <button type="submit" className="candidature-button">
            Enregistrer mes informations
          </button>
        </div>
      </form>
    </div>
  );
};

export default InternDetails;
