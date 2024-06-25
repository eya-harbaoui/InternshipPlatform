import React, { useState, useEffect } from "react";
import { FaRegLightbulb, FaRegCalendarAlt } from "react-icons/fa";
import { GrDocumentUser } from "react-icons/gr";
import { FiHome } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { NavbarLinks } from "../../components/Navbar/NavbarLinks";
import "./Postuler.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getUserIdFromLocalStorage from "../../UserAuth.js";
import { FaTrash, FaUpload } from "react-icons/fa";
import "../../../src/components/StudentForm/StudentForm.css";

const Postuler = () => {
  const location = useLocation();
  const jobDetails = location.state ? location.state.jobDetails : null;
  const { role, userId } = getUserIdFromLocalStorage() || {};

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    studyLevel: "",
    establishment: "",
    address: "",
    cv: null,
    recommendationLetter: "",
  });
  const [fileInputKey, setFileInputKey] = useState(null);
  const [editing, setEditing] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");

  //Récupérer les infos de l'etudiant

  const fetchProfileInfo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/students/profile/${userId}`
      );
      if (response.data) {
        console.log("response", response.data);
        setFormData({ ...formData, ...response.data });
        setSelectedFileName(response.data.cv);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations de profil :",
        error
      );
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProfileInfo();
    }
    console.log(jobDetails);
  }, [userId]);

  const navigate = useNavigate();

  //Modifier les infos de l'étudiant

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    //console.log("formdata", formData);
    //console.log("jobDetails", jobDetails);
  };

  //Récupératon de CV

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("file", file);
    if (file.type === "application/pdf") {
      if (editing) {
        setFormData({
          ...formData,
          cv: file,
        });
        console.log("Nom du fichier :", file.name); // Afficher le nom du fichier sélectionné
        setSelectedFileName(file.name); // Mettre à jour le nom du fichier sélectionné
      } else {
        // Ne rien faire si le mode édition n'est pas activé
      }
    } else {
      alert("Veuillez sélectionner un fichier PDF.");
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

  //Voir si l'etudiant est connecté ou pas pour qu'il puisse postuler

  const handlePostulerForm = () => {
    // Vérifier si l'utilisateur est connecté en vérifiant s'il existe un identifiant utilisateur dans le local storage
    const isLoggedIn = userId !== null; // S'assurer que userId est défini et non nul

    if (isLoggedIn) {
      // Si l'utilisateur est connecté, vérifiez son rôle
      if (role === "Student") {
        setShowForm(true);
      } else {
        // Rediriger vers la page d'inscription si l'utilisateur n'est pas un étudiant
        navigate("/signup_student");
      }
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };
  const handleSave = async () => {
    try {
      console.log(formData, "formData puuuuut");
      console.log(userId, "userId");
      await axios.put(
        `http://localhost:8000/students/profile/${userId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setEditing(false);
      toast.success("Informations modifiées avec succès! ");
    } catch (error) {
      toast.error("Erreur lors de l'envoi des informations de profil :", error);
    }
  };

  if (!jobDetails) {
    return null; // Masquer le composant si jobDetails n'est pas fourni
  }

  //Fonction pour lancer une candidature

  const handleSubmitApplication = async (e) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/application/postuler",
        {
          applicant: userId,
          offer: jobDetails._id,
          status: "en cours",
        }
      );
      console.log("Réponse du backend:", response.data);
      toast.success("Candidature soumise avec succès.");
      setShowForm(false);
      // Gérer la réponse du backend, par exemple afficher un message de succès
    } catch (error) {
      console.error("Erreur lors de l'envoi de la candidature :", error);
      toast.error("Erreur lors de l'envoi de la candidature.");

      // Gérer les erreurs, par exemple afficher un message d'erreur
    }
  };

  return (
    <div className="postuler">
      <Navbar links={NavbarLinks()} />
      <div className="centered-container">
        <h2 className="title-postuler">Postuler vers cette offre !</h2>
        <GrDocumentUser className="icon-postuler" />
      </div>
      <h2>{jobDetails.title}</h2>
      <p>{jobDetails.nature}</p>
      <p>{jobDetails.details}</p>
      <div className="tags">
        <div className="tag">
          <FaRegLightbulb /> {jobDetails.domain.name}
        </div>
        <div className="tag">
          <FiHome /> {jobDetails.mode}
        </div>
        <div className="tag">
          <FaRegCalendarAlt /> {jobDetails.period + "Mois"}
        </div>
      </div>
      {jobDetails.skills.length > 0 && (
        <div>
          <h3>Les compétences demandées :</h3>
          {jobDetails.skills.map((skillItem) => (
            <div key={skillItem.skill._id}>
              <p>
                {skillItem.skill.name} : {skillItem.level}
              </p>
            </div>
          ))}
        </div>
      )}
      {!showForm && (
        <button className="postuler-button" onClick={handlePostulerForm}>
          Postuler
        </button>
      )}
      {showForm && (
        <>
          <button
            className="postuler-button"
            onClick={!editing ? handleEdit : handleSave}
          >
            {editing ? "Enregistrer mon profil" : "Modifier mon profil"}{" "}
          </button>
          <div className="student-form-container">
            <>
              <div className="student-form-row">
                <input
                  type="text"
                  name="firstName"
                  placeholder="Nom"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={true}
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Prénom"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={true}
                />
              </div>
              <div className="student-form-row">
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Numéro de téléphone"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  disabled={!editing}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Adresse email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={true}
                />
              </div>

              <div className="student-form-row">
                <input
                  type="text"
                  name="studyLevel"
                  placeholder="Niveau d'étude"
                  value={formData.studyLevel}
                  onChange={handleChange}
                  required
                  disabled={true}
                />
                <input
                  type="text"
                  name="establishment"
                  placeholder="Établissement"
                  value={formData.establishment}
                  onChange={handleChange}
                  required
                  disabled={true}
                />
              </div>

              <div className="student-form-row">
                <input
                  type="text"
                  name="address"
                  placeholder="Adresse postale"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  disabled={true}
                />
                {!formData.cv ? (
                  <>
                    <button
                      className="CV-button"
                      type="button"
                      onClick={() =>
                        document.getElementById("fileInput").click()
                      }
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
                      disabled={true}
                    />
                  </>
                ) : (
                  <>
                    <button className="CV-button" type="button" disabled={true}>
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
                  className="cover-letter"
                  disabled={true}
                />
              </div>
              <div className="student-form-row">
                <button
                  type="submit"
                  className="candidature-button"
                  onClick={handleSubmitApplication}
                >
                  Envoyer ma candidature
                </button>
              </div>
            </>
          </div>
        </>
      )}
    </div>
  );
};

export default Postuler;
