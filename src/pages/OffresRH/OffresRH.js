// Import des bibliothèques et composants nécessaires depuis React et d'autres fichiers
import React, { useState, useEffect } from "react";
import OffresRHCard from "../../components/OffresCard/OffresRHCard.js"; // Composant de carte pour les offres RH
import "./OffresRH.css"; // Styles spécifiques pour cette page
import Navbar from "../../components/Navbar/Navbar"; // Barre de navigation
import axios from "axios"; // Pour les requêtes HTTP
import { Select, Modal } from "antd"; // Composants d'interface utilisateur Ant Design
import {
  durationOptions,
  modeOptions,
  natureOptions,
} from "../../components/Filter/FilterOptions.js"; // Options pour les filtres
import Filter from "../../components/Filter/Filter"; // Composant pour filtrer les offres
import { MdOutlineContentPasteSearch } from "react-icons/md"; // Icône de recherche
import { RHNavbarLinks } from "../../components/Navbar/RHNavbarLinks"; // Liens spécifiques à la barre de navigation RH
import { v4 as uuidv4 } from "uuid"; // Pour générer des identifiants uniques
import { toast } from "react-toastify"; // Bibliothèque pour les notifications
import { SkillsLevel } from "../../components/OffresCard/SkillsLevel.js"; //liste des compétences recquises
const { Option } = Select; // Option de sélection pour Ant Design

// Composant principal OffresRH
const OffresRH = () => {
  // Définition des états et fonctions
  const [filter, setFilter] = useState({
    searchTerm: "",
    domain: "",
    duration: "",
    mode: "",
    nature: "",
  }); // État pour les filtres
  const [data, setData] = useState([]); // État pour stocker les données des offres
  const [domainOptions, setDomainOptions] = useState([]); // Options de domaine pour les filtres
  const [domains, setDomains] = useState([]); // État pour stocker les domaines
  const [offer, setOffer] = useState({});

  // Fonction pour effacer les filtres
  const handleClearFilter = () => {
    setFilter({
      searchTerm: "",
      domain: "",
      duration: "",
      mode: "",
      nature: "",
    });
  };

  // Fonction pour récupérer les domaines depuis l'API
  const fetchDomains = async () => {
    try {
      const response = await axios.get("http://localhost:8000/Domaines");
      if (response.data) {
        console.log("responseeee", response.data);
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
      stage.stageTitle
        .toLowerCase()
        .includes(filter.searchTerm.toLowerCase()) &&
      (filter.domain === "" || stage.domainTag === filter.domain) &&
      (filter.duration === "" || stage.durationTag === filter.duration) &&
      (filter.mode === "" || stage.modeTag === filter.mode) &&
      (filter.nature === "" || stage.stageNature === filter.nature)
    );
  });

  // Fonction pour récupérer les données des offres depuis l'API
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/offers");
      const sortedData = response.data.sort((a, b) => {
        return new Date(b.publicationDate) - new Date(a.publicationDate);
      });
      setData(sortedData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  // Fonction pour envoyer une offre à l'API
  const sendOffer = async () => {
    try {
      const id = uuidv4(); // Générer un ID unique
      const offerWithId = {
        id: id,
        ...offer,
        OfferStatus: "brouillon",
      };
      const response = await axios.post(
        "http://localhost:8000/offers",
        offerWithId
      );
      console.log("Offre ajoutée avec succès:", response.data);
      toast.success("Offre ajoutée avec succès !");
      setIsModalOpen(false);
      setOffer(...offer, {
        stageTitle: "",
        stageNature: "",
        stageDescription: "",
        domainTag: "",
        modeTag: "",
        durationTag: "",
        competences: [],
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'offre:", error);
    }
  };

  // Effet pour charger les données initiales et les domaines une seule fois au chargement de la page
  useEffect(() => {
    fetchData();
    fetchDomains();
  });

  // États pour la gestion de la fenêtre modale d'ajout d'offre
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    sendOffer();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setOffer(...offer, {
      stageTitle: "",
      stageNature: "",
      stageDescription: "",
      domainTag: "",
      modeTag: "",
      durationTag: "",
      competences: [],
    });
  };

  // États pour la sélection de domaine, niveau de compétence et compétences pour chaque domaine
  const [niveauCompetence, setNiveauCompetence] = useState({});
  const [domaineSelectionne, setDomaineSelectionne] = useState("");
  const [competencesDomaine, setCompetencesDomaine] = useState({});

  // Fonction pour gérer le changement de domaine
  const handleDomaineChange = (domaine) => {
    setDomaineSelectionne(domaine);
    setOffer({ ...offer, domainTag: domaine });
    const competences =
      domains.find((d) => d.domainName === domaine)?.competences || [];
    setCompetencesDomaine({ ...competencesDomaine, [domaine]: competences });
  };

  // Fonction pour gérer le changement de compétence et son niveau
  const handleCompetenceChange = (competence, niveau) => {
    const updatedCompetences = {
      ...offer.competences,
      [competence]: niveau,
    };
    setOffer({ ...offer, competences: updatedCompetences });
  };

  // Rendu du composant OffresRH
  return (
    <div className="offres-RH-page">
      <Navbar links={RHNavbarLinks} />
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
          <OffresRHCard key={index} {...stage} id={stage.id} />
        ))}
      </div>
      {isModalOpen && (
        <Modal
          title="Ajouter une offre de stage"
          visible={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Ajouter Offre"
          cancelText="Annuler l'ajout de cette offre"
        >
          <div className="modal-content">
            <h3>Remplir les informations de l'offre</h3>
            <input
              type="text"
              placeholder="Titre de stage"
              className="input-text-design"
              value={offer.stageTitle}
              onChange={(e) =>
                setOffer({ ...offer, stageTitle: e.target.value })
              }
            />
            <textarea
              type="text"
              placeholder="description de stage"
              className="textarea-design"
              value={offer.stageDescription}
              onChange={(e) =>
                setOffer({ ...offer, stageDescription: e.target.value })
              }
            />
            <Select
              placeholder="Domaine de stage"
              className="modal-input"
              style={{ width: "100%" }}
              onChange={handleDomaineChange}
              value={offer.domainTag}
            >
              {domainOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="Nature de stage"
              className="modal-input"
              style={{ width: "100%" }}
              value={offer.stageNature}
              onChange={(value) => setOffer({ ...offer, stageNature: value })}
            >
              {natureOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="Mode de stage"
              className="modal-input"
              style={{ width: "100%" }}
              value={offer.modeTag}
              onChange={(value) => setOffer({ ...offer, modeTag: value })}
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
              value={offer.durationTag}
              onChange={(value) => setOffer({ ...offer, durationTag: value })}
            >
              {durationOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
            <div className="competences-container">
              <h3>Compétences demandées :</h3>
              {competencesDomaine[domaineSelectionne]?.map((competence) => (
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
  );
};

export default OffresRH;
