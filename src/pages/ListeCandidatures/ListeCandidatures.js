import React, { useState, useEffect } from "react";
import {
  Select,
  Button,
  Row,
  Col,
  Modal,
  DatePicker,
  Input,
  Radio,
  Popover,
} from "antd";
import { FaRegUser } from "react-icons/fa";
import CandidatsCard from "../../components/CandidatsCard/CandidatsCard";
import ListeCandidatureCard from "../../components/CandidatureCard/ListeCandidatureCard";
import { RHNavbarLinks } from "../../components/Navbar/RHNavbarLinks";
import Navbar from "../../components/Navbar/Navbar";
import { BsSend } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import axios from "axios";
import { useParams } from "react-router-dom";
import { CandidaturesStatusList } from "../../components/CandidatureCard/statusUtils";

const ListeCandidatures = () => {
  const { Option } = Select;
  const [candidatures, setCandidatures] = useState([]);
  const [candidats, setCandidats] = useState([]);
  const [selectedCandidature, setSelectedCandidature] = useState(null);
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [interview, setInterview] = useState({
    id: "",
    CandidatId: "",
    type: "",
    date: null,
    heure: null,
    mode: "",
    address: "",
    link: "",
    technicalValidatorId: null,
  });
  const [technicalValidators, setTechnicalValidators] = useState([]);
  const [selectedTechnicalValidator, setSelectedTechnicalValidator] =
    useState(null);

  const getStudentApplicationsForOffer = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/Student_Application?OfferId=${id}`
      );
      setCandidats(response.data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des candidatures étudiantes :",
        error
      );
    }
  };

  const fetchTechnicalValidators = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/TechnicalValidators"
      );
      setTechnicalValidators(response.data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des validateurs techniques :",
        error
      );
    }
  };

  useEffect(() => {
    getStudentApplicationsForOffer();
    fetchTechnicalValidators();
  }, []);

  const handleProgramInterview = (candidature) => {
    setSelectedCandidature(candidature);
    showModal();
  };

  const sendInterview = async () => {
    try {
      const response = await axios.post("http://localhost:8000/Interviews", {
        ...interview,
        technicalValidatorId: selectedTechnicalValidator,
      });
      console.log("Entretien programmé avec succès", response.data);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de la programmation de l'entretien", error);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="offres-page">
      <Navbar links={RHNavbarLinks} />
      <h3 className="title-offre">Liste des candidats</h3>
      <FaRegUser className="icon-offre" />
      <Row gutter={[16, 16]}>
        {Object.entries(candidatures).map(([status, count]) => (
          <Col key={status} xs={24} sm={12} md={8} lg={6}>
            <CandidatsCard candidatureStatus={status} nombreCandidats={count} />
          </Col>
        ))}
      </Row>
      {candidats.map((candidat) => (
        <ListeCandidatureCard
          key={candidat.id}
          Title={`${candidat.firstName} ${candidat.lastName}`}
          candidatureStatus={candidat.candidatureStatus}
          candidatureDate={candidat.candidatureDate}
          showActions={true}
          firstButtonName="programmer un entretien"
          secondButtonName="voir profil"
          FirstIcon={BsSend}
          SecondIcon={CgProfile}
          firstButtonFunction={() => handleProgramInterview(candidat)}
          isProgramInterviewDisabled={
            [
              "en cours",
              "entretien technique",
              "entretien RH programmé",
            ].includes(candidat.candidatureStatus)
              ? false
              : true
          }
          statusRefusePopover={
            candidat.candidatureStatus === "refusé" ? candidat.motifRefus : null
          }
        />
      ))}
      <Modal
        title="Programmer un entretien"
        visible={isModalOpen}
        onOk={sendInterview}
        onCancel={handleCancel}
        okText="Envoyer un email au candidat"
        cancelText="Annuler l'envoie"
      >
        <div className="modal-content">
          <h3>Type d'entretien</h3>
          <Select
            placeholder="Sélectionnez le type d'entretien"
            style={{ width: "100%" }}
            onChange={(value) => setInterview({ ...interview, type: value })}
            value={interview.type}
          >
            <Option value="RH">Entretien RH</Option>
            <Option value="technique">Entretien technique</Option>
          </Select>

          <h3>Date de l'entretien</h3>
          <DatePicker
            onChange={(date) => setInterview({ ...interview, date })}
            value={interview.date}
          />

          <h3>Heure de l'entretien</h3>
          <Input
            type="time"
            onChange={(e) =>
              setInterview({ ...interview, heure: e.target.value })
            }
            value={interview.heure}
          />

          <h3>Mode de l'entretien</h3>
          <Radio.Group
            onChange={(e) =>
              setInterview({ ...interview, mode: e.target.value })
            }
            value={interview.mode}
          >
            <Radio value="en ligne">En ligne</Radio>
            <Radio value="présentiel">Présentiel</Radio>
          </Radio.Group>

          {interview.mode === "présentiel" && (
            <>
              <h3>Adresse de l'entretien</h3>
              <Input
                placeholder="Adresse de l'entretien"
                onChange={(e) =>
                  setInterview({ ...interview, address: e.target.value })
                }
                value={interview.address}
              />
            </>
          )}

          {interview.mode === "en ligne" && (
            <>
              <h3>Lien de l'entretien</h3>
              <Input
                placeholder="Lien de l'entretien en ligne"
                onChange={(e) =>
                  setInterview({ ...interview, link: e.target.value })
                }
                value={interview.link}
              />
            </>
          )}

          {interview.type === "technique" && (
            <>
              <h3>Validateur technique</h3>
              <Select
                placeholder="Sélectionnez un validateur technique"
                style={{ width: "100%" }}
                onChange={(value) => setSelectedTechnicalValidator(value)}
                value={selectedTechnicalValidator}
              >
                {technicalValidators.map((validator) => (
                  <Option key={validator.id} value={validator.id}>
                    {`${validator.firstName} ${validator.lastName}`}
                  </Option>
                ))}
              </Select>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ListeCandidatures;
