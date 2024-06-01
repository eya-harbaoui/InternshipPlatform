import React, { useState, useEffect } from "react";
import "./ManagerDomains.css";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import { MdOutlineContentPasteSearch } from "react-icons/md";
import { ManagerNavbarLinks } from "../../components/Navbar/ManagerNavbarLinks";
import DomainCard from "../../components/DomainCard/DomainCard";
import { Modal, Input, Tag, Button, Select } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getUserIdFromLocalStorage from "../../UserAuth.js";

const ManagerDomains = () => {
  const { Option } = Select;

  const [data, setData] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [skills, setSkills] = useState([]);
  const { role, userId } = getUserIdFromLocalStorage() || {};
  const [fetchedSkills, setFetchedSkills] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/domain");
      setData(response.data);
      //console.log("data", data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleEdit = (domain) => {
    setSelectedDomain(domain);
    setName(domain.name);
    setModalVisible(true);
  };

  const handleDelete = async (_id) => {
    try {
      await axios.delete(`http://localhost:8000/domain/${_id}`);
      toast.success("Domaine supprimé avec succès");
    } catch (error) {
      console.error("Error deleting domain: ", error);
    }
  };
  const fetchSkills = async () => {
    try {
      const response = await axios.get("http://localhost:8000/skill");
      setFetchedSkills(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleModalOk = async () => {
    try {
      await axios.put(`http://localhost:8000/domain/${selectedDomain._id}`, {
        name,
        skills: skills, // Utilisez les compétences modifiées
      });
      toast.success("Domaine modifié avec succès");
      setModalVisible(false);
      setSelectedDomain(null);
      setName(""); // Vider le nom du domaine après l'ajout
      setSkills([]); // Vider les compétences après l'ajout
    } catch (error) {
      console.error("Error updating domain: ", error);
    }
  };

  const handleCompetenceChangeAddDomain = (value) => {
    setSkills(value);
    console.log(skills, "after adding");
  };

  const addDomain = async () => {
    try {
      await axios.post(`http://localhost:8000/domain`, {
        name,
        skills,
      });
      toast.success("Domaine ajouté avec succès");
      setAddModalVisible(false);
      setSelectedDomain(null);

      setName(""); // Vider le nom du domaine après l'ajout
      setSkills([]); // Vider les compétences après l'ajout
    } catch (error) {
      console.error("Error adding domain: ", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchSkills();
  }); // Correction: Ajout d'un tableau vide pour déclencher useEffect uniquement lors du montage initial

  return (
    <>
      <div className="domaines-Manager-page">
        <Navbar links={ManagerNavbarLinks(userId)} />
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
          data.map((domainItem) => (
            <DomainCard
              key={domainItem._id}
              domain={domainItem}
              handleEdit={() => {
                handleEdit(domainItem);
              }}
              handleDelete={() => {
                handleDelete(domainItem._id);
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
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Sélectionnez des compétences"
          onChange={handleCompetenceChangeAddDomain}
          value={skills}
        >
          {fetchedSkills.map((competence) => (
            <Option key={competence._id} value={competence._id}>
              {competence.name}
            </Option>
          ))}
        </Select>
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
        }}
      >
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom du domaine"
        />

        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Sélectionnez des compétences"
          onChange={handleCompetenceChangeAddDomain}
          value={skills}
        >
          {fetchedSkills.map((competence) => (
            <Option key={competence._id} value={competence._id}>
              {competence.name}
            </Option>
          ))}
        </Select>
      </Modal>
    </>
  );
};

export default ManagerDomains;
