import React from 'react'
import "./Acceuil.css";
const Acceuil = () => {
  return (
    <div className="container">
      <div className="header">
        <h1 className="welcome">
          Bienvenue sur la plateforme de stage de l'entreprise X !
        </h1>
      </div>

      <div className="cta">
        <button>Explorer les opportunités</button>
        <button>Postulez facilement</button>
      </div>

      <div className="subtext">
        Clients Satisfaits, Ils nous adorent ! C'est évident !
      </div>

      <div className="testimonials">
        <p>Témoignage 1: [Nom du Stagiaire]</p>
        <p>Témoignage 2: [Nom du Stagiaire]</p>
        <p>Témoignage 3: [Nom du Stagiaire]</p>
      </div>

      <div className="subtext">Témoignages de Stagiaires</div>

      <div className="subtext">Parcourez les stages par domaine, durée,...</div>

      <div className="subtext">
        Soumettez votre candidature avec votre CV et une brève lettre de
        motivation.
      </div>

      <div className="subtext">
        Découvrez des opportunités de stage passionnantes avec l'entreprise X.
        Explorez les stages, postulez facilement et suivez vos candidatures, le
        tout au même endroit.
      </div>

      <div className="footer">
        <p>(c) 2024 Example, Inc</p>
        <button>S'inscrire</button>
      </div>
    </div>
  );
}
export default Acceuil