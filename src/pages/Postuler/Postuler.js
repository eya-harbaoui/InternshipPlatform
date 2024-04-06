import React, { useState } from "react";
import "./Postuler.css"; // CSS pour le style
import { useLocation } from "react-router-dom"; // Importer useLocation
import { FaRegLightbulb, FaRegCalendarAlt } from "react-icons/fa";
import { FiHome } from "react-icons/fi";
import Navbar from "../../components/Navbar/Navbar";
import { NavbarLinks } from "../../components/Navbar/NavbarLinks";
const Postuler = () => {
  const location = useLocation(); // Utiliser useLocation pour obtenir l'emplacement actuel
  const jobDetails = location.state ? location.state.jobDetails : null; // Vérifier si location.state est défini
  const [showForm,setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phoneNumber: "",
    email: "",
    levelOfStudy: "",
    institution: "",
    cvFile: null,
    coverLetter: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, cvFile: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ajouter la logique pour soumettre le formulaire
  };
  const handlePostulerForm =(e)=> {
    e.preventDefault();
    setShowForm(true);
  }

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
        <p>Les compétences demandées : </p>
        {jobDetails.competences &&
          Object.entries(jobDetails.competences).map(([competence, niveau]) => (
            <p key={competence}>
              {competence}: {niveau}
            </p>
          ))}
      </div>
      <button onClick={handlePostulerForm}>Postuler</button>
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
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Numéro de téléphone"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <input
              type="email"
              name="email"
              placeholder="Adresse email"
              value={formData.email}
              onChange={handleChange}
              required
            />
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
            <label htmlFor="cvFile">Ajouter mon CV (format PDF)</label>
            <input
              type="file"
              id="cvFile"
              name="cvFile"
              accept="application/pdf"
              onChange={handleFileChange}
              required
            />
            {formData.cvFile && (
              <span className="cv-added">
                CV ajouté: {formData.cvFile.name}
              </span>
            )}
          </div>
          <div className="form-row">
            <textarea
              name="coverLetter"
              placeholder="Lettre de motivation"
              value={formData.coverLetter}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <button type="submit">Envoyer ma candidature</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Postuler;
