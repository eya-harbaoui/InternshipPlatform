import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaArchive } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import "./OffresCard.css";
import { Tag, Modal, Select, Input, InputNumber } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StageCard from "./StageCard";
import {
  durationOptions,
  modeOptions,
  natureOptions,
} from "../../components/Filter/FilterOptions.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getStatusTag } from "./OffersStatus.js";
import { SkillsLevel } from "../../components/OffresCard/SkillsLevel.js"; //liste des compétences recquises
const { Option } = Select;
const { TextArea } = Input;

const OffresRHCard = ({
  _id,
  title,
  nature,
  details,
  domain,
  mode,
  period,
  status,
  skills,
  createdAt,
}) => {
  //Define the states and functions
  const [domainOptions, setDomainOptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState({});
  const [selectedOfferInitial, setSelectedOfferInitial] = useState({});

  const [domaineSelectionne, setDomaineSelectionne] = useState();
  const [skillsDomaine, setskillsDomaine] = useState();
  const [changeskills, setChangeskills] = useState(false);
  const [domainsWithSkillNames, setDomainsWithSkillNames] = useState([]); // État pour stocker les domaines
  //Modal de modification de l'offre
  const showModal = () => {
    setIsModalOpen(true);
    console.log("selectedOfferkkk", selectedOffer);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const fetchOfferDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8000/offre/${id}`);
      if (response.data) {
        const selectedOfferData = response.data;
        //console.log(selectedOfferData, "jjjjjj");
        setSelectedOffer(selectedOfferData);
        setSelectedOfferInitial(selectedOfferData);
        setDomaineSelectionne(selectedOfferData.domain);
        console.log();
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails de l'offre :",
        error
      );
    }
  };

  //Voir les candidature de l'offre sélectionnée

  const handleCandidatures = () => {
    navigate(`/liste_candidatures/${selectedOffer._id}`);
  };

  useEffect(() => {
    fetchDomains();
  });

  //liste des domaines avec leurs compétences
  const fetchDomains = async () => {
    try {
      const response = await axios.get("http://localhost:8000/domain");

      // Stocker les domaines avec les compétences formatées dans l'état
      setDomainsWithSkillNames(response.data);
      console.log("res", response.data);
      // Créer les options pour le menu déroulant de sélection de domaine
      const domainOptions = domainsWithSkillNames.map((domain) => ({
        value: domain._id, // Utiliser l'ID du domaine comme valeur
        label: domain.name,
      }));
      setDomainOptions(domainOptions);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations de profil :",
        error
      );
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setChangeskills(false);
    setSelectedOffer(selectedOfferInitial);
    setDomaineSelectionne(selectedOfferInitial.domain);
  };
  const navigate = useNavigate();
  let { tagColor, tagText } = getStatusTag(status);

  //Publier une offre

  const handlePublishClick = async () => {
    try {
      await axios.put(`http://localhost:8000/offre/${selectedOffer._id}`, {
        ...selectedOffer,
        status: "en cours de validation",
      });
      toast.success("Offre en cours de validation");
    } catch (error) {
      console.error("Erreur lors de la publication de l'offre :", error);
    }
  };

  //modifier une offre

  const handleEditClick = async () => {
    try {
      console.log(selectedOffer, "selectedOffer puuuuut");
      await axios.put(
        `http://localhost:8000/offre/${selectedOffer._id}`,
        selectedOffer
      );
      setChangeskills(false);
      setIsModalOpen(false);
      toast.success("Offre modifiée");
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi des informations de profil :",
        error
      );
    }
  };

  //supprimer une offre

  const handleDeleteClick = async () => {
    try {
      await axios.delete(`http://localhost:8000/offre/${selectedOffer._id}`);
      toast.success("Offre supprimée");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'offre :", error);
    }
  };

  //archiver une offre

  const handleArchiveClick = async () => {
    try {
      await axios.put(`http://localhost:8000/offre/${selectedOffer._id}`, {
        ...selectedOffer,
        status: "archivé",
      });
      toast.success("Offre archivée avec succès");
    } catch (error) {
      console.error("Erreur lors de l'archivage de l'offre :", error);
    }
  };
  //mettre en brouillon une offre
  const handleDraftClick = async () => {
    try {
      await axios.put(`http://localhost:8000/offre/${selectedOffer._id}`, {
        ...selectedOffer,
        status: "brouillon",
      });
      toast.success("Offre Mise en brouillon avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise en brouillon de l'offre :", error);
    }
  };

  //modifier le domaine d'une offre

  const handleDomaineChange = (domaine) => {
    setDomaineSelectionne(domaine);
    console.log("domaineSelectionneé", domaineSelectionne);
    setSelectedOffer({
      ...selectedOffer,
      domain: domaine,
      skills: [],
    });
    setChangeskills(true);
    const skills =
      domainsWithSkillNames.find((d) => d._id === domaine)?.skills || [];
    console.log("skillsssssssssss", skills);
    setskillsDomaine({ ...skillsDomaine, [domaine]: skills });
    console.log(skillsDomaine, "hhhh");
  };

  //modifier les compétences et leurs niveaux d'une offre

  const handleskillChange = (skillId, level) => {
    // Vérifier si la compétence existe déjà dans la liste des compétences de l'offre
    const existingSkillIndex = selectedOffer.skills.findIndex(
      (skill) => skill.skill === skillId
    );

    if (existingSkillIndex !== -1) {
      // Si la compétence existe déjà, mettre à jour son niveau de compétence
      const updatedSkills = [...selectedOffer.skills];
      updatedSkills[existingSkillIndex].level = level;

      // Mettre à jour l'état de l'offre avec les compétences mises à jour
      setSelectedOffer((prevOffer) => ({
        ...prevOffer,
        skills: updatedSkills,
      }));
    } else {
      // Si la compétence n'existe pas, ajouter une nouvelle compétence à la liste
      const newSkill = {
        skill: skillId,
        level: level,
      };

      // Mettre à jour l'état de l'offre en ajoutant la nouvelle compétence
      setSelectedOffer((prevOffer) => ({
        ...prevOffer,
        skills: [...prevOffer.skills, newSkill],
      }));
    }
  };

  useEffect(() => {
    // New useEffect for fetching selected offer details
    if (_id) {
      fetchOfferDetails(_id);
    }
  }, [_id]);
  return (
    <>
      <div className="stage-card">
        <StageCard
          student={false}
          title={title}
          nature={nature}
          details={details}
          mode={mode}
          domain={domain}
          period={period}
          buttonName={"publier"}
          handleButtonFunction={handlePublishClick}
          status={status}
          viewButton={true}
        />
        <div className="actions">
          <span
            className="action"
            onClick={showModal}
            disabled={status === "publié"}
            style={{
              pointerEvents: status === "publié" ? "none" : "auto",
              opacity: status === "publié" ? 0.5 : 1,
            }}
          >
            <FaEdit className="action-icon" />
            Modifier
          </span>
          <span
            className="action"
            onClick={handleDeleteClick}
            disabled={status === "publié"}
            style={{
              pointerEvents: status === "publié" ? "none" : "auto",
              opacity: status === "publié" ? 0.5 : 1,
            }}
          >
            <FaTrash className="action-icon" />
            Supprimer
          </span>
          <span className="action" onClick={handleArchiveClick}>
            <FaArchive className="action-icon" />
            Archiver
          </span>
          <span className="action" onClick={handleDraftClick}>
            <FaArchive className="action-icon" />
            Mettre en brouillon
          </span>
          <span className="action" onClick={handleCandidatures}>
            <FaUserGroup className="action-icon" />
            Candidatures
          </span>
        </div>

        <Tag color={tagColor} className="status-tag">
          {tagText}
        </Tag>

        {isModalOpen && (
          <Modal
            title="Modifier l'offre"
            visible={isModalOpen}
            onOk={handleEditClick}
            onCancel={handleCancel}
            okText="Modifier cette offre"
            cancelText="Annuler la modification"
          >
            <div className="modal-content">
              <h3>Modifier les informations de l'offre</h3>
              <Input
                type="text"
                placeholder="Titre de stage"
                className="modal-input"
                value={selectedOffer.title}
                onChange={(e) =>
                  setSelectedOffer({
                    ...selectedOffer,
                    title: e.target.value,
                  })
                }
              />
              <TextArea
                type="text"
                placeholder="description de stage"
                className="modal-input"
                value={selectedOffer.details}
                onChange={(e) =>
                  setSelectedOffer({
                    ...selectedOffer,
                    details: e.target.value,
                  })
                }
              />
              <Select
                placeholder="Domaine de stage"
                className="modal-input"
                style={{ width: "100%" }}
                value={domaineSelectionne?._id || domaineSelectionne}
                onChange={handleDomaineChange}
              >
                {domainOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
              <Select
                placeholder="Mode de stage"
                className="modal-input"
                style={{ width: "100%" }}
                value={selectedOffer.mode}
                onChange={(value) => {
                  setSelectedOffer({ ...selectedOffer, mode: value });
                }}
              >
                {modeOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
              <InputNumber
                min={1}
                max={10}
                placeholder="Durée de stage"
                className="modal-input"
                style={{ width: "100%" }}
                value={selectedOffer.period}
                onChange={(value) =>
                  setSelectedOffer({ ...selectedOffer, period: value })
                }
              />
              <Select
                placeholder="Nature de stage"
                className="modal-input"
                style={{ width: "100%" }}
                value={selectedOffer.nature}
                onChange={(value) =>
                  setSelectedOffer({ ...selectedOffer, nature: value })
                }
              >
                {natureOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
              <div className="skills-container">
                <h3>Compétences demandées :</h3>
                {!changeskills &&
                  selectedOffer.skills &&
                  selectedOffer.skills.map((skillItem) => (
                    <p key={skillItem.skill._id}>
                      {skillItem.skill.name}: {skillItem.level}
                    </p>
                  ))}
                {changeskills &&
                  skillsDomaine[domaineSelectionne]?.map((skill) => (
                    <div key={skill._id} className="skill-input">
                      <span>{skill.name}</span>
                      <Select
                        className="modal-input"
                        onChange={(value) => handleskillChange(skill, value)}
                      >
                        {SkillsLevel.map((level, index) => (
                          <option key={index} value={level}>
                            {level}
                          </option>
                        ))}
                      </Select>
                    </div>
                  ))}
              </div>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default OffresRHCard;
