import React from "react";
import { Link } from "react-router-dom";
//import "./Acceuil.css";
import Navbar from "../../components/Navbar/Navbar";
import { AcceuilNavbarLinks } from "../../components/Navbar/AcceuilNavbarLinks";
function Acceuil() {
  return (
    <div className="homepage">
      <Navbar links={AcceuilNavbarLinks}></Navbar>
      <div className="section">
        <div className="text">
          <h2>Texte à gauche</h2>
          <p>Description du texte...</p>
        </div>
        <div className="image">
          <img src="chemin/vers/image.jpg" alt="Image à droite" />
        </div>
      </div>
      <div className="section">
        <div className="image">
          <img src="chemin/vers/image.jpg" alt="Image à gauche" />
        </div>
        <div className="text">
          <h2>Texte à droite</h2>
          <p>Description du texte...</p>
        </div>
      </div>
      <div className="section">
        <div className="text">
          <h2>Texte à gauche</h2>
          <p>Description du texte...</p>
        </div>
        <div className="image">
          <img src="chemin/vers/image.jpg" alt="Image à droite" />
        </div>
      </div>
      <div className="testimonials">
        <div className="testimonial">Témoignage 1</div>
        <div className="testimonial">Témoignage 2</div>
        <div className="testimonial">Témoignage 3</div>
      </div>
      <div className="cta">
        <p>Rejoignez-nous!</p>
        <Link to="/signup">
          <button>S'inscrire</button>
        </Link>
      </div>
      <footer>Pied de page</footer>
    </div>
  );
}

export default Acceuil;
