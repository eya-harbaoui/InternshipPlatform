import React, { useState, useEffect } from "react";
import {
  FaRegLightbulb,
  FaRegCalendarAlt,
  FaTrash,
  FaUpload,
} from "react-icons/fa";
import { GrDocumentUser } from "react-icons/gr";
import { FiHome } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { NavbarLinks } from "../../components/Navbar/NavbarLinks";
import "./Postuler.css";
import StudentForm from "../../components/StudentForm/StudentForm";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Postuler = () => {
  const location = useLocation();
  const jobDetails = location.state ? location.state.jobDetails : null;
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
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

  const fetchProfileInfo = async () => {
    try {
      const response = await axios.get("http://localhost:8000/user");
      if (response.data) {
        console.log("responseeee", response.data);
        setFormData(response.data[0]);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations de profil :",
        error
      );
    }
  };

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log("netbadeeeel", formData);
    console.log("jobDetails", jobDetails);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file.type === "application/pdf") {
      setFormData({ ...formData, cv: file });
    } else {
      alert("Veuillez sélectionner un fichier PDF.");
    }
  };

  const handleDeleteFile = () => {
    setFormData({ ...formData, cv: null });
    setFileInputKey(Date.now()); // Pour forcer le re-render de l'input file
  };

  const handlePostulerForm = () => {
    setShowForm(true);
  };

  const handleEdit = () => {
    setEditing(true);
  };

  if (!jobDetails) {
    return null; // Masquer le composant si jobDetails n'est pas fourni
  }

  const getCurrentDate = () => {
    const date = new Date();
    return date.toISOString();
  };

  const handleSubmitApplication = async (e) => {
    const candidatureDate = getCurrentDate(); // Obtenez la date actuelle
    try {
      const response = await axios.post(
        "http://localhost:8000/Student_Application",
        {
          id: formData.id,
          OfferId: jobDetails.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          studyLevel: formData.studyLevel,
          establishment: formData.establishment,
          address: formData.address,
          cv: formData.cv,
          recommendationLetter: formData.recommendationLetter,
          candidatureStatus: "en cours",
          candidatureDate: candidatureDate, // Utilisez la date actuelle
        }
      );
      console.log("Réponse du backend:", response.data);
      toast.success(
        "Candidature soumise avec succès. Vous recevrez un email de confirmation."
      );
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
      <Navbar links={NavbarLinks} />
      <div className="centered-container">
        <h2 className="title-postuler">Postuler vers cette offre !</h2>
        <GrDocumentUser className="icon-postuler" />
      </div>
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
        <>
          <button className="postuler-button" onClick={handleEdit}>
            Modifier Mes Infos
          </button>
          <div>
            <StudentForm
              formData={formData}
              handleChange={handleChange}
              handleDeleteFile={handleDeleteFile}
              handleFileChange={handleFileChange}
              fileInputKey={fileInputKey}
              buttonName={"Envoyer ma candidature"}
              handleOnClickButtonForm={handleSubmitApplication}
              disabled={!editing}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Postuler;
