import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Input from "../../components/Input/Input";
import Navbar from "../../components/Navbar/Navbar";
import { FaRegLightbulb } from "react-icons/fa";
import { FiHome } from "react-icons/fi";
import { FaRegCalendarAlt } from "react-icons/fa";
import "./Postuler.css"

function Postuler({ stageTitle, domainTag, modeTag, durationTag, offerLink }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    numTel: "",
    email: "",
    niveauEtude: "",
    etablissement: "",
    lettreMotivation: "",
    cv: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, cv: file });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Envoyer les données du formulaire
    setShowForm(false);
    toast.success("Candidature envoyée !");
  };

  return (
    <div className="container">
      <Navbar />
      <h1>{stageTitle}</h1>
      <h2>Informations sur l'offre :</h2>
      <div className="tags">
        <div className="tag">
          <FaRegLightbulb /> {domainTag}
        </div>
        <div className="tag">
          <FiHome /> {modeTag}
        </div>
        <div className="tag">
          <FaRegCalendarAlt /> {durationTag}
        </div>
      </div>
      <h2>Postuler :</h2>
      {!showForm && <button onClick={() => setShowForm(true)}>Postuler</button>}
      {showForm && (
        <form onSubmit={handleSubmit}>
          <Input
            label="Nom"
            name="nom"
            value={formData.nom}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Prénom"
            name="prenom"
            value={formData.prenom}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Numéro de téléphone"
            name="numTel"
            value={formData.numTel}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Adresse email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Niveau d'étude"
            name="niveauEtude"
            value={formData.niveauEtude}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Établissement"
            name="etablissement"
            value={formData.etablissement}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Lettre de motivation"
            name="lettreMotivation"
            value={formData.lettreMotivation}
            onChange={handleInputChange}
            required
          />
          <Input
            type="file"
            label="CV"
            name="cv"
            onChange={handleFileChange}
            required
          />
          <button type="submit">Envoyer ma candidature</button>
        </form>
      )}
    </div>
  );
}

export default Postuler;
