// Import des bibliothèques et composants nécessaires depuis React et d'autres fichiers
import React, { useState, useEffect } from "react";
import OffresRHCard from "../../components/OffresCard/OffresRHCard.js"; // Composant de carte pour les offres RH
import "./OffresRH.css"; // Styles spécifiques pour cette page
import Navbar from "../../components/Navbar/Navbar"; // Barre de navigation
import axios from "axios"; // Pour les requêtes HTTP
import { Select, Modal, Input, InputNumber, Form } from "antd"; // Composants d'interface utilisateur Ant Design
import {
  modeOptions,
  natureOptions,
} from "../../components/OffresCard/Options.js"; // Options pour les filtres
import Filter from "../../components/Filter/Filter"; // Composant pour filtrer les offres
import { MdOutlineContentPasteSearch } from "react-icons/md"; // Icône de recherche
import { RHNavbarLinks } from "../../components/Navbar/RHNavbarLinks"; // Liens spécifiques à la barre de navigation RH
import { toast } from "react-toastify"; // Bibliothèque pour les notifications
import { SkillsLevel } from "../../components/OffresCard/SkillsLevel.js"; //liste des compétences recquises
import getUserIdFromLocalStorage from "../../UserAuth.js";
const { Option } = Select; // Option de sélection pour Ant Design
const { TextArea } = Input;

// Composant principal OffresRH
const OffresRH = () => {
  const { role, userId } = getUserIdFromLocalStorage() || {};

  // Définition des états et fonctions
  const [filter, setFilter] = useState({
    searchTerm: "",
    domain: "",
    period: "",
    mode: "",
    nature: "",
  }); // État pour les filtres
  const [data, setData] = useState([]); // État pour stocker les données des offres
  const [domainOptions, setDomainOptions] = useState([]); // Options de domaine pour les filtres
  const [skillsWithNames, setSkillsWithNames] = useState([]); // État pour stocker les domaines
  const [domainsWithSkillNames, setDomainsWithSkillNames] = useState([]); // État pour stocker les domaines

  const [offer, setOffer] = useState({
    title: "",
    nature: "",
    details: "",
    domain: "",
    mode: "",
    period: "",
    skills: [],
  });
  const [errorMessage, setErrorMessage] = useState("");
  // Fonction pour effacer les filtres
  const handleClearFilter = () => {
    setFilter({
      searchTerm: "",
      domain: "",
      period: "",
      mode: "",
      nature: "",
    });
  };

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

  // Fonction pour gérer les changements de filtre
  const handleFilterChange = (key, value) => {
    setFilter({ ...filter, [key]: value });
  };

  // Fonction pour filtrer les données des offres en fonction des filtres sélectionnés
  const filteredStageData = data.filter((stage) => {
    return (
      stage.title.toLowerCase().includes(filter.searchTerm.toLowerCase()) &&
      (filter.domain === "" || stage.domain._id === filter.domain) &&
      (filter.period === "" || stage.period === filter.period) &&
      (filter.mode === "" || stage.mode === filter.mode) &&
      (filter.nature === "" || stage.nature === filter.nature)
    );
  });

  // Fonction pour récupérer les données des offres depuis l'API
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/offre");
      //console.log(response,"reeees")
      const sortedData = response.data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setData(sortedData);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  // Fonction ajouter une offre
  const sendOffer = async () => {
    try {
      // Créer la nouvelle offre avec les données formatées
      const newOffer = {
        ...offer,
        status: "brouillon",
        createdBy: userId,
      };
      console.log(newOffer, "newoffer");

      const response = await axios.post(
        "http://localhost:8000/offre",
        newOffer
      );
      //console.log("Offre ajoutée avec succès:", response.data);
      toast.success("Offre ajoutée avec succès !");
    } catch (error) {
      toast.error("Erreur lors de l'ajout de l'offre:", error);
    }
  };

  useEffect(() => {
    fetchDomains();
    fetchData();
  });

  // États pour la gestion de la fenêtre modale d'ajout d'offre
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setErrorMessage("");
    setIsModalOpen(true);
  };
  const handleOk = () => {
    // Vérification de chaque champ s'il est vide
    if (
      !offer.title ||
      !offer.details ||
      !offer.domain ||
      !offer.nature ||
      !offer.mode ||
      !offer.period ||
      !offer.skills
    ) {
      console.log(offer, "offff");
      // Mettre à jour le message d'erreur pour indiquer les champs manquants
      setErrorMessage("Veuillez remplir tous les champs ! ");
    } else {
      setErrorMessage("");
      // Fermer le modal
      setIsModalOpen(false);
      // Envoyer l'offre
      sendOffer();
      setOffer({
        title: "",
        nature: "",
        details: "",
        domain: "",
        mode: "",
        period: "",
        skills: [],
      });
      setSkillsWithNames([]);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setErrorMessage("");
    setOffer({
      title: "",
      nature: "",
      details: "",
      domain: "",
      mode: "",
      period: "",
      skills: [],
    });
    setSkillsWithNames([]);
  };

  // Fonction pour gérer le changement de domaine
  const handleDomaineChange = (domaineId) => {
    // Réinitialiser les compétences avec les noms à une liste vide
    setOffer({ ...offer, domain: domaineId, skills: [] });
    // Trouver le domaine sélectionné dans les options de domaine
    const selectedDomain = domainsWithSkillNames.find(
      (domain) => domain._id === domaineId
    );
    // Récupérer les compétences associées au domaine sélectionné
    const skillsOfSelectedDomain = selectedDomain ? selectedDomain.skills : [];
    console.log(skillsOfSelectedDomain, "ttttttttttttttttt");

    // Mettre à jour l'état des compétences avec IDs et noms
    setSkillsWithNames(skillsOfSelectedDomain);
    // Mettre à jour le domaine sélectionné
  };

  const handleskillChange = (skillId, level) => {
    // Vérifier si la compétence existe déjà dans la liste des compétences de l'offre
    const existingSkillIndex = offer.skills.findIndex(
      (skill) => skill.skill === skillId
    );

    if (existingSkillIndex !== -1) {
      // Si la compétence existe déjà, mettre à jour son niveau de compétence
      const updatedSkills = [...offer.skills];
      updatedSkills[existingSkillIndex].level = level;

      // Mettre à jour l'état de l'offre avec les compétences mises à jour
      setOffer((prevOffer) => ({
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
      setOffer((prevOffer) => ({
        ...prevOffer,
        skills: [...prevOffer.skills, newSkill],
      }));
    }
  };

  // Rendu du composant OffresRH
  return (
    <div className="offres-RH-page">
      <Navbar links={RHNavbarLinks(userId)} />
      <h2 className="title-offre-RH">Gestion des offres</h2>
      <MdOutlineContentPasteSearch className="icon-offre-RH" />
      <div className="button-container">
        <button className="add-offer-button" onClick={showModal}>
          Ajouter une offre
        </button>
      </div>
      <Filter
        filter={filter}
        setFilter={setFilter}
        handleClear={handleClearFilter}
      />
      <div className="stage-cards-RH">
        {filteredStageData.map((stage, index) => (
          <OffresRHCard key={index} {...stage} _id={stage._id} />
        ))}
      </div>
      {isModalOpen && (
        <Modal
          title="Ajouter une offre de stage"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Ajouter Offre"
          cancelText="Annuler l'ajout de cette offre"
          width={600}
        >
          <div className="modal-content">
            <h3>Remplir les informations de l'offre</h3>

            <Form layout="vertical">
              <Form.Item
                name="title"
                label="Titre de stage"
                rules={[{ required: true }]}
              >
                <Input
                  type="text"
                  placeholder="Titre de stage"
                  className="modal-input"
                  value={offer.title}
                  onChange={(e) =>
                    setOffer({ ...offer, title: e.target.value })
                  }
                />
              </Form.Item>
              <Form.Item
                name="details"
                label="Description de stage"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <TextArea
                  type="text"
                  placeholder="description de stage"
                  className="modal-input"
                  value={offer.details}
                  onChange={(e) =>
                    setOffer({ ...offer, details: e.target.value })
                  }
                />
              </Form.Item>
              <Form.Item
                name="domain"
                label="Domaine de stage"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Domaine de stage"
                  className="modal-input"
                  style={{ width: "100%" }}
                  onChange={handleDomaineChange}
                  value={offer.domain}
                >
                  {domainOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="nature"
                label="Nature de stage"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Nature de stage"
                  className="modal-input"
                  style={{ width: "100%" }}
                  value={offer.nature}
                  onChange={(value) => setOffer({ ...offer, nature: value })}
                >
                  {natureOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="mode"
                label="Mode de stage"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Mode de stage"
                  className="modal-input"
                  style={{ width: "100%" }}
                  value={offer.mode}
                  onChange={(value) => setOffer({ ...offer, mode: value })}
                >
                  {modeOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="period"
                label="Durée de stage"
                rules={[{ required: true }]}
              >
                <InputNumber
                  min={1}
                  max={10}
                  placeholder="Durée de stage"
                  className="modal-input"
                  style={{ width: "100%" }}
                  value={offer.period}
                  onChange={(value) => setOffer({ ...offer, period: value })}
                />
              </Form.Item>

              <div className="skills-container">
                <h3>Compétences demandées :</h3>
                {skillsWithNames.map((skill) => (
                  <div key={skill._id} className="skill-input">
                    <span>{skill.name}</span>

                    <Select
                      className="modal-input"
                      onChange={(value) => handleskillChange(skill._id, value)}
                      required
                    >
                      {SkillsLevel.map((level, index) => (
                        <Option key={index} value={level}>
                          {level}
                        </Option>
                      ))}
                    </Select>
                  </div>
                ))}
              </div>
              {/* Affichage du message d'erreur */}
              {errorMessage && <h4 style={{ color: "red" }}>{errorMessage}</h4>}
            </Form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OffresRH;
