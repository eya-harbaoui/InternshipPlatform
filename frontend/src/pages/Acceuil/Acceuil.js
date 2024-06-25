import React from "react";
import { Link, Outlet } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import image from "./background.jpg";
import image1 from "./imageAcceuil1.jpg";
import image2 from "./imageAcceuil2.jpg";
import image3 from "./imageAcceuil3.jpg";
import { useNavigate } from "react-router-dom";
import { AcceuilNavbarLinks } from "../../components/Navbar/AcceuilNavbarLinks";
import { Card, Row, Col, Button } from "antd";
import "./Acceuil.css";
import { FcFinePrint, FcSettings, FcBusinessContact } from "react-icons/fc";
let firstRender = true;
//axios.defaults.withCredentials = true;
function Acceuil() {
  //const { loggedIn } = useContext(AuthContext);
  const gridStyle = {
    width: "200",
    height: "1000",

    textAlign: "center",
  };
  let navigate = useNavigate();
  /* const sendLogout = async() =>{
    const res = await axios.post("/logout", null, {
      withCredentials: true,
    });
    if (res.status == 200) {
      return res;
    }
    return new Error("unable to logout");

  }
  const handleLogout = ()=>{
    sendLogout();
    

  }*/

  return (
    <div style={{ backgroundColor: "white" }}>
      <Navbar links={AcceuilNavbarLinks} page="acceuil"></Navbar>
      <div className="divcontainerhome">
        <div className="divhome">
          <div className="hellotext">
            <h1>Bienvenue sur notre plateforme de stages !</h1>
          </div>
          <div className="imgbackground">
            <img src={image} alt="image" />
          </div>
          <div className="hellotext">
            <h1>Explorez ce que nous proposons !</h1>
          </div>
        </div>

        <div className="divcards">
          <div className="site-card-wrapper" id="about">
            <Row gutter={16}>
              <Col span={8}>
                <Card bordered={false} hoverable={true} className="cardclass">
                  <div className="cardcontainer">
                    <h1>Recherche des offres de stage</h1>
                    <FcFinePrint className="logocard"></FcFinePrint>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card bordered={false} hoverable={true} className="cardclass">
                  <div className="cardcontainer">
                    <h1>Gestion des offres</h1>
                    <FcSettings className="logocard"></FcSettings>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card bordered={false} hoverable={true} className="cardclass">
                  <div className="cardcontainer">
                    <h1>Gestion et suivi des candidatures</h1>
                    <FcBusinessContact className="logocard"></FcBusinessContact>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
        <div className="divphotos">
          <div className="divhome1">
            <div className="imgbackground3">
              <img src={image3} alt="image3" />
            </div>
            <div className="hellotext3">
              <h1>Recherche et gestion des offres de stage</h1>
              <p>
                Trouvez les offres de stages qui correspondent à vos compétences
                et intérêts, et gérez facilement vos offres.
              </p>
            </div>
          </div>
          <div className="divhome1">
            <div className="imgbackground2">
              <img src={image2} alt="image2" />
            </div>
            <div className="hellotext2">
              <h1>Gestion des candidatures</h1>
              <p>Soumettez et suivez vos candidatures facilement</p>
            </div>
          </div>
          <div className="divhome1">
            <div className="imgbackground1">
              <img src={image1} alt="image1" />
            </div>
            <div className="hellotext1" id="login">
              <h1>Commencez maintenant !</h1>
              <p>
                Inscrivez-vous ou connectez-vous pour commencer à utiliser notre
                platforme
              </p>
              <button
                className="loginfromhome"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Se Connecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Acceuil;
