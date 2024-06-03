import React from "react";
import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
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
const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/Home" exact element={<Acceuil />}></Route>
          <Route path="/signup" exact element={<Signup />} />

          <Route path="/login" exact element={<Login />} />
          <Route path="/signup_student" exact element={<SignupEtudiant />} />
          <Route path="/confirm_email" exact element={<EmailConfirmation />} />
          <Route path="/Offres" exact element={<Offres />} />
          <Route path="/Offres/:id" element={<Postuler />} />
          <Route path="/Mes_candidatures" element={<Candidatures />}></Route>
          <Route path="/UserDetails" element={<InternDetails />}></Route>
          <Route path="/RH_Offres/:id" element={<OffresRH />}></Route>
          <Route
            path="/liste_candidatures/:id"
            element={<ListeCandidaturesRH />}
          />
          <Route
            path="Validation_des_offres/:id"
            element={<ManagerValidation />}
          ></Route>
          <Route
            path="Historique_des_offres/:id"
            element={<ManagerHistoryOffers />}
          ></Route>
          <Route path="/Domaines" element={<ManagerDomains />}></Route>
          <Route path="/Compétences" element={<ManagerCompétences />}></Route>
          <Route
            path="Candidatures_Assignées/:id"
            element={<ListeCandidaturesVT />}
          ></Route>
          <Route path="/Admin" element={<Portal />}>
            <Route path="Gestion_Des_Domaines" element={<Domstages />} />
            <Route
              path="Gestion_Des_Compétences"
              element={<CompetencesStages />}
            />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<TabUtilisateurs />} />
          </Route>
        </Routes>
      </div>
      <ToastContainer position="top-center"></ToastContainer>
    </BrowserRouter>
  );
};
export default App;
