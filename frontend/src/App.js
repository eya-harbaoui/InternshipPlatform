import React from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import Signup from "./pages/Signup/signup";
import Login from "./pages/Login/login";
import { ToastContainer } from "react-toastify";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import Offres from "./pages/Offres/Offres";
import Postuler from "./pages/Postuler/Postuler";
import Candidatures from "./pages/Candidatures/Candidatures";
import InternDetails from "./pages/InternDetails/InternDetails";
import Acceuil from "./pages/Acceuil/Acceuil";
import OffresRH from "./pages/OffresRH/OffresRH";
import ListeCandidaturesRH from "./pages/ListeCandidaturesRH/ListeCandidaturesRH";
import Portal from "./components/Admin/Portal";
import Dashboard from "./components/Admin/Dashboard";
import TabUtilisateurs from "./components/Admin/TabUsers";
import Domstages from "./components/Admin/DomaineStages";
import ManagerValidation from "./pages/ManagerValidation/ManagerValidation";
import ManagerDomains from "./pages/ManagerDomains/ManagerDomains";
import ListeCandidaturesVT from "./pages/ListeCandidatureVT/ListeCandidauteVT";
import CompetencesStages from "./components/Admin/CompetencesStages";
import SignupEtudiant from "./pages/SignupEtudiant/SignupEtudiant";
import EmailConfirmation from "./pages/EmailConfirmation/EmailConfirmation";
import ManagerCompétences from "./pages/ManagerCompetences/ManagerCompetences";
import ManagerHistoryOffers from "./pages/ManagerHistoryOffers/ManagerHistoryOffers";
import Role from "./pages/Role/Role";
import getUserIdFromLocalStorage from "../src/UserAuth";
import Indisponible from "./pages/Indisponible/Indisponible";
import ListeCandidatureManager from "./pages/ListeCandidaturesManager/ListeCandidatureManager";
import LoginEtudiant from "./pages/LoginEtudiant/LoginEtudiant";
const roleToRoutes = {
  Admin: [
    { path: "/Admin", element: <Portal /> },
    { path: "/Gestion_Des_Domaines/:id", element: <Domstages /> },
    { path: "/Gestion_Des_Compétences/:id", element: <CompetencesStages /> },
    { path: "/dashboard/:id", element: <Dashboard /> },
    { path: "/users/:id", element: <TabUtilisateurs /> },
  ],
  "Assistant RH": [
    { path: "/RH_Offres/:id", element: <OffresRH /> },
    { path: "/liste_candidatures/:id", element: <ListeCandidaturesRH /> },
  ],
  "Responsable RH": [
    { path: "/RH_Offres/:id", element: <OffresRH /> },
    { path: "/liste_candidatures/:id", element: <ListeCandidaturesRH /> },
  ],
  "Manager": [
    { path: "/Validation_des_offres/:id", element: <ManagerValidation /> },
    { path: "/Historique_des_offres/:id", element: <ManagerHistoryOffers /> },
    { path: "/Domaines/:id", element: <ManagerDomains /> },
    { path: "/Compétences/:id", element: <ManagerCompétences /> },
    {
      path: "/liste_candidature_manager/:id",
      element: <ListeCandidatureManager />,
    },
  ],
  "Validator": [
    { path: "/Candidatures_Assignées/:id", element: <ListeCandidaturesVT /> },
  ],
  "student": [
    { path: "/Mes_candidatures/:id", element: <Candidatures /> },
    { path: "/UserDetails/:id", element: <InternDetails /> },
  ],
};

const App = () => {
  const { role, userId } = getUserIdFromLocalStorage() || {};

  const allowedRoutes = roleToRoutes[role] || [];

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Acceuil />} />
          <Route path="/role" element={<Role />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup_student" element={<SignupEtudiant />} />
          <Route path="/confirm_email" element={<EmailConfirmation />} />
          <Route path="/indisponible" element={<Indisponible />}></Route>
          <Route path="/Offres" element={<Offres />} />
          <Route path="/Offres/:id" element={<Postuler />} />
          <Route path="/Mes_candidatures/:id" element={<Candidatures />} />
          <Route path="/UserDetails/:id" element={<InternDetails />} />
          <Route path="/RH_Offres/:id" element={<OffresRH />} />
          <Route
            path="/liste_candidatures/:id"
            element={<ListeCandidaturesRH />}
          />
          <Route
            path="/Validation_des_offres/:id"
            element={<ManagerValidation />}
          />
          <Route
            path="/Historique_des_offres/:id"
            element={<ManagerHistoryOffers />}
          />
          <Route
            path="/liste_candidature_manager/:id"
            element={<ListeCandidatureManager />}
          ></Route>
          <Route path="/Domaines/:id" element={<ManagerDomains />} />
          <Route path="/Compétences/:id" element={<ManagerCompétences />} />
          <Route
            path="/Candidatures_Assignées/:id"
            element={<ListeCandidaturesVT />}
          />
          <Route path="/Admin" element={<Portal />}>
            <Route path="Gestion_Des_Domaines/:id" element={<Domstages />} />
            <Route
              path="Gestion_Des_Compétences/:id"
              element={<CompetencesStages />}
            />
            <Route path="dashboard/:id" element={<Dashboard />} />
            <Route path="users/:id" element={<TabUtilisateurs />} />
          </Route>

          {allowedRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
          {/* Allow access to these routes even if not logged in */}
          {!userId && (
            <>
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup_student" element={<SignupEtudiant />} />
              <Route path="/login_student" element={<LoginEtudiant />}></Route>
            </>
          )}
        </Routes>
      </div>
      <ToastContainer position="top-center" />
    </BrowserRouter>
  );
};

export default App;
