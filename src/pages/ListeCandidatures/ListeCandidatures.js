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
import {
  BsCalendar,
  BsPersonCheck,
  BsPersonDash,
  BsEye,
  BsFillExclamationTriangleFill,
} from "react-icons/bs";
import CandidatsCard from "../../components/CandidatsCard/CandidatsCard";
import ListeCandidatureCard from "../../components/CandidatureCard/ListeCandidatureCard";
import { RHNavbarLinks } from "../../components/Navbar/RHNavbarLinks";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import { useParams } from "react-router-dom";

const ListeCandidatures = () => {
  const { Option } = Select;
  const [candidatures, setCandidatures] = useState({});
  const [candidats, setCandidats] = useState([]);
  const [selectedCandidature, setSelectedCandidature] = useState(null);
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isRefuseModalOpen, setIsRefuseModalOpen] = useState(false);
  const [acceptMessage, setAcceptMessage] = useState("");
  const [refuseMessage, setRefuseMessage] = useState("");
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
  const [selectedCandidate, setSelectedCandidate] = useState(null); // New state for selected candidate

  const getStudentApplicationsForOffer = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/Student_Application?OfferId=${id}`
      );
      const countByStatus = response.data.reduce((acc, curr) => {
        acc[curr.candidatureStatus] = (acc[curr.candidatureStatus] || 0) + 1;
        return acc;
      }, {});
      setCandidats(response.data);
      setCandidatures(countByStatus);
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
  }, []); // Use empty array as second argument to run effect only once

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

      const newStatus =
        interview.type === "RH"
          ? "entretien RH programmé"
          : "entretien technique programmé";
      const updatedCandidature = {
        ...selectedCandidature,
        candidatureStatus: newStatus,
      };

      await axios.put(
        `http://localhost:8000/Student_Application/${selectedCandidature.id}`,
        updatedCandidature
      );

      const updatedCandidats = candidats.map((candidat) =>
        candidat.id === selectedCandidature.id ? updatedCandidature : candidat
      );

      setCandidats(updatedCandidats);
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

  const acceptCandidate = (candidat) => {
    setSelectedCandidature(candidat);
    setIsAcceptModalOpen(true);
  };

  const handleAcceptModalOk = async () => {
    try {
      await axios.put(
        `http://localhost:8000/Student_Application/${selectedCandidature.id}`,
        { ...selectedCandidature, candidatureStatus: "accepté" }
      );
      setIsAcceptModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'acceptation du candidat", error);
    }
  };

  const handleAcceptModalCancel = () => {
    setIsAcceptModalOpen(false);
  };

  const refuseCandidate = (candidat) => {
    setSelectedCandidature(candidat);
    setIsRefuseModalOpen(true);
  };

  const handleRefuseModalOk = async () => {
    try {
      await axios.put(
        `http://localhost:8000/Student_Application/${selectedCandidature.id}`,
        { ...selectedCandidature, candidatureStatus: "refusé" }
      );
      setIsRefuseModalOpen(false);
    } catch (error) {
      console.error("Erreur lors du refus du candidat", error);
    }
  };

  const handleRefuseModalCancel = () => {
    setIsRefuseModalOpen(false);
  };

  const viewProfile = (candidat) => {
    setSelectedCandidate(candidat);
  };

  const actions = [
    {
      name: "programmer un entretien",
      onClick: handleProgramInterview,
      disabled: (candidat) =>
        ["en cours", "entretien technique", "entretien RH programmé"].includes(
          candidat.candidatureStatus
        ),
      Icon: BsCalendar,
    },
    {
      name: "voir profil",
      onClick: viewProfile,
      disabled: () => false,
      Icon: BsEye,
    },
    {
      name: "accepter",
      onClick: acceptCandidate,
      disabled: () => false,
      Icon: BsPersonCheck,
    },
    {
      name: "refuser",
      onClick: refuseCandidate,
      disabled: () => false,
      Icon: BsPersonDash,
    },
  ];

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
          actions={actions.map((action) => ({
            ...action,
            onClick: () => action.onClick(candidat),
            disabled: action.disabled(candidat),
          }))}
          description={candidat.description}
        />
      ))}
      <Modal
        title="Profil du candidat"
        visible={selectedCandidate !== null}
        onCancel={() => setSelectedCandidate(null)}
        footer={[
          <Button key="back" onClick={() => setSelectedCandidate(null)}>
            Fermer
          </Button>,
        ]}
      >
        {selectedCandidate && (
          <div>
            <p>
              <strong>Nom: </strong> {selectedCandidate.firstName}{" "}
              {selectedCandidate.lastName}
            </p>
            <p>
              <strong>Email: </strong> {selectedCandidate.email}
            </p>
            <p>
              <strong>Téléphone: </strong> {selectedCandidate.phoneNumber}
            </p>
            <p>
              <strong>Niveau: </strong> {selectedCandidate.studyLevel}
            </p>
            <p>
              <strong>Etablissement: </strong>{" "}
              {selectedCandidate.establishement}
            </p>
            <p>
              <strong>CV: </strong> {selectedCandidate.cv}
            </p>
            <p>
              <strong>Adresse: </strong> {selectedCandidate.address}
            </p>
            <p>
              <strong>lettre de recommendation: </strong>{" "}
              {selectedCandidate.recommendationLetter}
            </p>
          </div>
        )}
      </Modal>

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

      <Modal
        title="Accepter le candidat"
        visible={isAcceptModalOpen}
        onOk={handleAcceptModalOk}
        onCancel={handleAcceptModalCancel}
        okText="Accepter"
        cancelText="Annuler"
      >
        <Input
          placeholder="Ajouter un message personnalisé"
          value={acceptMessage}
          onChange={(e) => setAcceptMessage(e.target.value)}
        />
      </Modal>

      <Modal
        title="Refuser le candidat"
        visible={isRefuseModalOpen}
        onOk={handleRefuseModalOk}
        onCancel={handleRefuseModalCancel}
        okText="Refuser"
        cancelText="Annuler"
      >
        <Input
          placeholder="Ajouter un motif de refus"
          value={refuseMessage}
          onChange={(e) => setRefuseMessage(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default ListeCandidatures;
