import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserEdit } from "react-icons/fa";
import Navbar from "../../components/Navbar/Navbar";
import { NavbarLinks } from "../../components/Navbar/NavbarLinks";
import getUserIdFromLocalStorage from "../../UserAuth.js";
import "./InternDetails.css";
import { FaTrash, FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const InternDetails = () => {
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
    role: "",
  });
  const [fileInputKey, setFileInputKey] = useState(null);
  const [editing, setEditing] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const { role, userId } = getUserIdFromLocalStorage() || {};

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
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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

  return (
    <div className="intern-details">
      <Navbar links={NavbarLinks()} />
      <div className="centered-container-user-intern">
        <h2 className="title-user-intern">Bonjour {formData.firstName}!</h2>
        <FaUserEdit className="icon-user-intern" />
        <p>
          Je renseigne mon identité et mes paramètres de connexion (Tous les
          champs sont obligatoires)
        </p>
      </div>
      <div className="intern-details-form"></div>

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
            disabled={!editing}
          />
          <input
            type="text"
            name="establishment"
            placeholder="Établissement"
            value={formData.establishment}
            onChange={handleChange}
            required
            disabled={!editing}
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
            disabled={!editing}
          />
          {!formData.cv ? (
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
                disabled={!editing}
              />
            </>
          ) : (
            <>
              <button className="CV-button" type="button">
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
            disabled={!editing}
          />
        </div>
        <button
          className="postuler-button"
          onClick={!editing ? handleEdit : handleSave}
        >
          {editing ? "Enregistrer mon profil" : "Modifier mon profil"}{" "}
        </button>
      </>
    </div>
  );
};

export default InternDetails;
