import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaArchive } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import "./OffresCard.css";
import { Tag, Modal, Select } from "antd";
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

const OffresRHCard = ({
  id,
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
  const [domains, setDomains] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState({});
  const [domaineSelectionne, setDomaineSelectionne] = useState();
  const [skillsDomaine, setskillsDomaine] = useState();
  const [changeskills, setChangeskills] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCandidatures = () => {
    navigate(`/liste_candidatures/${selectedOffer.id}`);
  };

  useEffect(() => {
    fetchDomains();
  });

  useEffect(() => {
    // New useEffect for fetching selected offer details
    if (id) {
      fetchOfferDetails(id);
    }
  }, [id]);

  const fetchDomains = async () => {
    try {
      const response = await axios.get("http://localhost:8000/Domaines");
      if (response.data) {
        setDomains(response.data);
        const domains = response.data.map((domain) => ({
          value: domain.domainName,
          label: domain.domainName,
        }));
        setDomainOptions([
          { value: "", label: "Tous les domaines" },
          ...domains,
        ]);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des domaines :", error);
    }
  };

  const fetchOfferDetails = async (id) => {
    // New function to fetch offer details
    try {
      const response = await axios.get(`http://localhost:8000/offers/${id}`);
      if (response.data) {
        setSelectedOffer(response.data);
        setDomaineSelectionne(response.data.domain);
        setskillsDomaine(response.data.skills || {});
        console.log("***selected offer****", selectedOffer);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails de l'offre :",
        error
      );
    }
  };

  const handleCancel = () => {
    setSelectedOffer({
      id: id,
      title: title,
      nature: nature,
      mode: mode,
      domain: domain,
      period: period,
      details: details,
      skills: skills,
      status: status,
      createdAt: createdAt,
    });
    setIsModalOpen(false);
    setChangeskills(false);
  };
  const navigate = useNavigate();
  let { tagColor, tagText } = getStatusTag(status);

  const handlePublishClick = async () => {
    try {
      // Implement your publish logic here
      await axios.put(`http://localhost:8000/offers/${selectedOffer.id}`, {
        ...selectedOffer,
        status: "en cours de validation",
      });
      toast.success("Offre en cours de validation");
    } catch (error) {
      console.error("Erreur lors de la publication de l'offre :", error);
    }
  };

  const handleEditClick = async () => {
    try {
      console.log(selectedOffer, "selectedOffer puuuuut");
      await axios.put(
        `http://localhost:8000/offers/${selectedOffer.id}`,
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

  const handleDeleteClick = async () => {
    try {
      await axios.delete(`http://localhost:8000/offers/${selectedOffer.id}`);
      toast.success("Offre supprimée");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'offre :", error);
    }
  };

  const handleArchiveClick = async () => {
    try {
      await axios.put(`http://localhost:8000/offers/${selectedOffer.id}`, {
        ...selectedOffer,
        status: "archivé",
      });
      toast.success("Offre archivée avec succès");
    } catch (error) {
      console.error("Erreur lors de l'archivage de l'offre :", error);
    }
  };

  const handleDomaineChange = (domaine) => {
    setDomaineSelectionne(domaine);
    setSelectedOffer({
      ...selectedOffer,
      domain: domaine,
      skills: {},
    });
    setChangeskills(true);
    const skills =
      domains.find((d) => d.domainName === domaine)?.skills || [];
    setskillsDomaine({ ...skillsDomaine, [domaine]: skills });
  };
  const handleCompetenceChange = (competence, niveau) => {
    const updatedskills = {
      ...selectedOffer.skills,
      [competence]: niveau,
    };
    setSelectedOffer({ ...selectedOffer, skills: updatedskills });
  };

  useEffect(() => {
    fetchDomains();
  });
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
              <input
                type="text"
                placeholder="Titre de stage"
                className="input-text-design"
                value={selectedOffer.title}
                onChange={(e) =>
                  setSelectedOffer({
                    ...selectedOffer,
                    title: e.target.value,
                  })
                }
              />
              <textarea
                type="text"
                placeholder="description de stage"
                className="textarea-design"
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
                value={domaineSelectionne}
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
              <Select
                placeholder="Durée de stage"
                className="modal-input"
                style={{ width: "100%" }}
                value={selectedOffer.period}
                onChange={(value) =>
                  setSelectedOffer({ ...selectedOffer, period: value })
                }
              >
                {durationOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
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
                  Object.entries(selectedOffer.skills).map(
                    ([competence, niveau]) => (
                      <p key={competence}>
                        {competence}: {niveau}
                      </p>
                    )
                  )}
                {changeskills &&
                  skillsDomaine[domaineSelectionne]?.map((competence) => (
                    <div key={competence} className="competence-input">
                      <span>{competence}</span>
                      <Select
                        className="modal-input"
                        onChange={(value) =>
                          handleCompetenceChange(competence, value)
                        }
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
