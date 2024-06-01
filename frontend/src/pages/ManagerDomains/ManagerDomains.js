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
  const [name, setName] = useState("");
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/domain");
      setData(response.data);
      console.log("data", data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleEdit = (domain) => {
    setSelectedDomain(domain);
    setName(domain.name);
    setSkills(domain.skills);
    setModalVisible(true);
  };

  const handleDelete = async (_id) => {
    try {
      await axios.delete(`http://localhost:8000/domain/${_id}`);
      toast.success("Domaine supprimé avec succès");
      fetchData();
    } catch (error) {
      console.error("Error deleting domain: ", error);
    }
  };

  const handleModalOk = async () => {
    try {
      await axios.put(`http://localhost:8000/domain/${selectedDomain._id}`, {
        name,
        skills,
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
      await axios.post(`http://localhost:8000/domain`, {
        name,
        skills,
      });
      toast.success("Domaine ajouté avec succès");
      setAddModalVisible(false);
      setName(""); // Vider le nom du domaine après l'ajout
      setSkills([]); // Vider les compétences après l'ajout
      setNewSkill(""); // Vider la nouvelle compétence après l'ajout
      fetchData();
    } catch (error) {
      console.error("Error adding domain: ", error);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() !== "") {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const deleteCompetence = (index) => {
    const updatedskills = [...skills];
    updatedskills.splice(index, 1);
    setSkills(updatedskills);
  };

  useEffect(() => {
    fetchData();
  }); // Correction: Ajout d'un tableau vide pour déclencher useEffect uniquement lors du montage initial

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
                handleDelete(domaine._id);
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
        <Input value={name} onChange={(e) => setName(e.target.value)} />
        {skills.map((skill, index) => (
          <Tag key={index} closable onClose={() => deleteCompetence(index)}>
            {skill}
          </Tag>
        ))}
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Nouvelle compétence"
          onPressEnter={addSkill}
          suffix={<Button onClick={addSkill}>Ajouter</Button>}
        />
      </Modal>
      {/* New Modal for adding domain */}
      <Modal
        title="Ajouter un domaine"
        visible={addModalVisible}
        onOk={addDomain}
        onCancel={() => {
          setAddModalVisible(false);
          setName(""); // Vider le nom du domaine si annulé
          setSkills([]); // Vider les compétences si annulé
          setNewSkill(""); // Vider la nouvelle compétence si annulé
        }}
      >
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom du domaine"
        />
        {skills.map((competence, index) => (
          <Tag key={index} closable onClose={() => deleteCompetence(index)}>
            {competence}
          </Tag>
        ))}
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Nouvelle compétence"
          onPressEnter={addSkill}
          suffix={<Button onClick={addSkill}>Ajouter</Button>}
        />
      </Modal>
    </>
  );
};

export default ManagerDomains;
