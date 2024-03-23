import React from "react";
import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import Signup from "./pages/Signup/signup";
import Login from "./pages/Login/login";
import { ToastContainer } from "react-toastify";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import Offres from "./pages/Offres/Offres";
import Postuler from "./pages/Postuler/Postuler";
import { useParams } from "react-router-dom";

function App() {
  const isLoggedIn = window.localStorage.getItem("loggedIn");
  // Function to check if the user is logged in
  const isUserLoggedIn = () => {
    return isLoggedIn === "true"; // Change the condition based on how you store the logged-in state
  };
  // Function to render the component or redirect if not logged in
  const renderRoute = (component, path) => {
    if (isUserLoggedIn()) {
      return component;
    } else {
      return <Navigate to="/login" />;
    }
  };
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/signup" exact element={<Signup />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/Offres" exact element={<Offres />} />
          
        </Routes>
      </div>
      <ToastContainer position="top-center"></ToastContainer>
    </BrowserRouter>
  );
}
export default App;
