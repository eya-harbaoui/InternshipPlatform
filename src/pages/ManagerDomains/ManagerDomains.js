import React, { useState, useEffect } from "react";
import "./ManagerDomains.css";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import { MdOutlineContentPasteSearch } from "react-icons/md";
import { ManagerNavbarLinks } from "../../components/Navbar/ManagerNavbarLinks";
import DomainCard from "../../components/DomainCard/DomainCard";
import { Modal, Input, Tag, Button } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManagerDomains = () => {
  const [data, setData] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [domainName, setDomainName] = useState("");
  const [competences, setCompetences] = useState([]);
  const [newCompetence, setNewCompetence] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/Domaines");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleEdit = (domain) => {
    setSelectedDomain(domain);
    setDomainName(domain.domainName);
    setCompetences(domain.competences);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/Domaines/${id}`);
      toast.success("Domaine supprimé avec succès");
      fetchData();
    } catch (error) {
      console.error("Error deleting domain: ", error);
    }
  };

  const handleModalOk = async () => {
    try {
      await axios.put(`http://localhost:8000/Domaines/${selectedDomain.id}`, {
        domainName,
        competences,
      });
      toast.success("Domaine modifié avec succès");
      setModalVisible(false);
      fetchData();
    } catch (error) {
      console.error("Error updating domain: ", error);
    }
  };

  const addDomain = async () => {
    try {
      await axios.post(`http://localhost:8000/Domaines`, {
        domainName,
        competences,
      });
      toast.success("Domaine ajouté avec succès");
      setAddModalVisible(false);
      setDomainName(""); // Vider le nom du domaine après l'ajout
      setCompetences([]); // Vider les compétences après l'ajout
      setNewCompetence(""); // Vider la nouvelle compétence après l'ajout
      fetchData();
    } catch (error) {
      console.error("Error adding domain: ", error);
    }
  };

  const addCompetence = () => {
    if (newCompetence.trim() !== "") {
      setCompetences([...competences, newCompetence.trim()]);
      setNewCompetence("");
    }
  };

  const deleteCompetence = (index) => {
    const updatedCompetences = [...competences];
    updatedCompetences.splice(index, 1);
    setCompetences(updatedCompetences);
  };

  useEffect(() => {
    fetchData();
  }, []); // Correction: Ajout d'un tableau vide pour déclencher useEffect uniquement lors du montage initial

  return (
    <>
      <div className="domaines-Manager-page">
        <Navbar links={ManagerNavbarLinks} />
        <h2 className="title-Manager-page">Gestion des domaines</h2>
        <MdOutlineContentPasteSearch className="icon-Manager-page" />
        <div className="button-container">
          <button
            className="add-domain-button"
            onClick={() => setAddModalVisible(true)}
          >
            Ajouter un domaine
          </button>
        </div>
        {data &&
          data.map((domaine, index) => (
            <DomainCard
              key={index}
              {...domaine}
              handleEdit={() => {
                handleEdit(domaine);
              }}
              handleDelete={() => {
                handleDelete(domaine.id);
              }}
            />
          ))}
      </div>
      <Modal
        title="Modifier le domaine"
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
      >
        <Input
          value={domainName}
          onChange={(e) => setDomainName(e.target.value)}
        />
        {competences.map((competence, index) => (
          <Tag key={index} closable onClose={() => deleteCompetence(index)}>
            {competence}
          </Tag>
        ))}
        <Input
          value={newCompetence}
          onChange={(e) => setNewCompetence(e.target.value)}
          placeholder="Nouvelle compétence"
          onPressEnter={addCompetence}
          suffix={<Button onClick={addCompetence}>Ajouter</Button>}
        />
      </Modal>
      {/* New Modal for adding domain */}
      <Modal
        title="Ajouter un domaine"
        visible={addModalVisible}
        onOk={addDomain}
        onCancel={() => {
          setAddModalVisible(false);
          setDomainName(""); // Vider le nom du domaine si annulé
          setCompetences([]); // Vider les compétences si annulé
          setNewCompetence(""); // Vider la nouvelle compétence si annulé
        }}
      >
        <Input
          value={domainName}
          onChange={(e) => setDomainName(e.target.value)}
          placeholder="Nom du domaine"
        />
        {competences.map((competence, index) => (
          <Tag key={index} closable onClose={() => deleteCompetence(index)}>
            {competence}
          </Tag>
        ))}
        <Input
          value={newCompetence}
          onChange={(e) => setNewCompetence(e.target.value)}
          placeholder="Nouvelle compétence"
          onPressEnter={addCompetence}
          suffix={<Button onClick={addCompetence}>Ajouter</Button>}
        />
      </Modal>
    </>
  );
};

export default ManagerDomains;
