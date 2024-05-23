import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserEdit } from "react-icons/fa";
import Navbar from "../../components/Navbar/Navbar";
import { NavbarLinks } from "../../components/Navbar/NavbarLinks";
import "./InternDetails.css";
import StudentForm from "../../components/StudentForm/StudentForm";

const InternDetails = () => {
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
    role: "",
  });
  const [fileInputKey, setFileInputKey] = useState(null);
  const [editing, setEditing] = useState(false);

  const fetchProfileInfo = async () => {
    try {
      const response = await axios.get("http://localhost:8000/Students");
      if (response.data) {
        console.log("responseeee", response.data);
        setFormData(response.data[1]);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    setFileInputKey(Date.now());
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      console.log(formData, "formData puuuuut");
      await axios.put(
        `http://localhost:8000/Students/${formData.id}`,
        formData
      );
      setEditing(false);
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi des informations de profil :",
        error
      );
    }
  };

  return (
    <div className="intern-details">
      <Navbar links={NavbarLinks} />
      <div className="centered-container-user-intern">
        <h2 className="title-user-intern">Bonjour {formData.firstName}!</h2>
        <FaUserEdit className="icon-user-intern" />
        <p>
          Je renseigne mon identité et mes paramètres de connexion (Tous les
          champs sont obligatoires)
        </p>
      </div>
      <div className="intern-details-form"></div>

      <StudentForm
        formData={formData}
        handleChange={handleChange}
        handleDeleteFile={handleDeleteFile}
        handleFileChange={handleFileChange}
        fileInputKey={fileInputKey}
        buttonName={editing ? "Enregistrer mon profil" : "Modifier mon profil"}
        disabled={!editing}
        handleOnClickButtonForm={!editing ? handleEdit : handleSave}
      />
    </div>
  );
};

export default InternDetails;
