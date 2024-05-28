import {React,useEffect} from "react";
import "./StudentForm.css";
import { FaTrash, FaUpload } from "react-icons/fa";
function StudentForm({
  formData,
  handleChange,
  handleFileChange,
  handleDeleteFile,
  fileInputKey,
  buttonName,
  handleOnClickButtonForm,
  disabled,
}) {

  return (
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
          disabled={disabled}
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
          disabled={disabled}
        />
        <input
          type="text"
          name="establishment"
          placeholder="Établissement"
          value={formData.establishment}
          onChange={handleChange}
          required
          disabled={disabled}
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
          disabled={disabled}
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
              disabled={disabled}
            />
          </>
        ) : (
          <div className="cv-info">
            <button
              className="CV-button"
              type="button"
              onClick={handleDeleteFile}
            >
              <FaTrash style={{ color: "red" }} />
              {formData.cvFileName}
            </button>

            {/* Affichez le nom du fichier */}
          </div>
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
          disabled={disabled}
        />
      </div>
      <div className="student-form-row">
        <button
          type="submit"
          className="candidature-button"
          onClick={handleOnClickButtonForm}
        >
          {buttonName}
        </button>
      </div>
    </>
  );
}

export default StudentForm;
