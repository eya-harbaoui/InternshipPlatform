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
import ListeCandidatures from "./pages/ListeCandidatures/ListeCandidatures";
import Portal from "./components/Admin/Portal";
import Dashboard from "./components/Admin/Dashboard";
import TabUtilisateurs from "./components/Admin/TabUsers";
import Domstages from "./components/Admin/DomaineStages";
import ManagerValidation from "./pages/ManagerValidation/ManagerValidation";
const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/Home" exact element={<Acceuil />}></Route>
          <Route path="/signup" exact element={<Signup />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/Offres" exact element={<Offres />} />
          <Route path="/Offres/:id" element={<Postuler />} />
          <Route path="/Mes_candidatures" element={<Candidatures />}></Route>
          <Route path="/UserDetails" element={<InternDetails />}></Route>
          <Route path="/RH_Offres" element={<OffresRH />}></Route>
          <Route
            path="/liste_candidatures/:id"
            element={<ListeCandidatures />}
          />
          <Route
            path="manager_validation"
            element={<ManagerValidation />}
          ></Route>
          <Route path="/portal" element={<Portal />}>
            <Route path="domainedestages" element={<Domstages />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="user-list" element={<TabUtilisateurs />} />
          </Route>
        </Routes>
      </div>
      <ToastContainer position="top-center"></ToastContainer>
    </BrowserRouter>
  );
};
export default App;
