import React, { useState } from "react";
import "./Postuler.css"; 
import { useLocation } from "react-router-dom"; 
import {
  FaRegLightbulb,
  FaRegCalendarAlt,
  FaTrash,
  FaUpload,
} from "react-icons/fa"; 
import { FiHome } from "react-icons/fi"; 
import Navbar from "../../components/Navbar/Navbar";
import { NavbarLinks } from "../../components/Navbar/NavbarLinks";

const Postuler = () => {
  const location = useLocation(); 
  const jobDetails = location.state ? location.state.jobDetails : null; 
  const [showForm, setShowForm] = useState(false);
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
  const [fileInputKey, setFileInputKey] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, cvFile: e.target.files[0] });
  };

  const handleDeleteFile = () => {
    setFormData({ ...formData, cvFile: null });
    setFileInputKey((prevKey) => prevKey + 1); // Pour forcer le re-render de l'input file
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ajouter la logique pour soumettre le formulaire
  };

  const handlePostulerForm = () => {
    setShowForm(true);
  };

  if (!jobDetails) {
    return null; // Masquer le composant si jobDetails n'est pas fourni
  }

  return (
    <div className="postuler">
      <Navbar links={NavbarLinks} />
      <h2>{jobDetails.stageTitle}</h2>
      <p>{jobDetails.stageNature}</p>
      <p>{jobDetails.stageDescription}</p>
      <div className="tags">
        <div className="tag">
          <FaRegLightbulb /> {jobDetails.domainTag}
        </div>
        <div className="tag">
          <FiHome /> {jobDetails.modeTag}
        </div>
        <div className="tag">
          <FaRegCalendarAlt /> {jobDetails.durationTag}
        </div>
      </div>
      <div>
        <h3>Les compétences demandées : </h3>
        {jobDetails.competences &&
          Object.entries(jobDetails.competences).map(([competence, niveau]) => (
            <p key={competence}>
              {competence}: {niveau}
            </p>
          ))}
      </div>
      {!showForm && (
        <button className="postuler-button" onClick={handlePostulerForm}>
          Postuler
        </button>
      )}
      {showForm && (
        <form onSubmit={handleSubmit}>
          <div className="form-row">
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
            <button
              className="CV-button"
              type="button"
              onClick={handleDeleteFile}
            >
              {formData.cvFile ? (
                <>
                  <FaTrash /> {formData.cvFile.name}
                </>
              ) : (
                <>
                  <FaUpload /> Ajouter votre CV (PDF)
                </>
              )}
            </button>
            <input
              key={fileInputKey}
              type="file"
              accept="application/pdf"
              style={{ display: "none" }}
              onChange={handleFileChange}
              ref={(fileInput) => fileInput && fileInput.click()}
            />
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
              Envoyer ma candidature
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Postuler;
