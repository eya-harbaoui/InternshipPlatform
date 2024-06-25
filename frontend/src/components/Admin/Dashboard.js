import React, { useEffect, useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import Card from "./Card";
import axios from "axios";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import "./sb-admin-2.min.css";
const BASE_URL = "http://localhost:8000";

Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

function Dashboard() {
  const [publishedOffersByYear, setPublishedOffersByYear] = useState([]);
  const [publishedOffersByMonth, setPublishedOffersByMonth] = useState([]);
  const [applicationsByMonth, setApplicationsByMonth] = useState([]);
  const [rejectedApplicationsByMonth, setRejectedApplicationsByMonth] =
    useState([]);
  const [acceptedApplicationsByMonth, setAcceptedApplicationsByMonth] =
    useState([]);
  const [receivedApplicationsByMonth, setReceivedApplicationsByMonth] =
    useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const offersByYearResponse = await axios.get(
          `${BASE_URL}/offers/by-year`
        );
        setPublishedOffersByYear(offersByYearResponse.data);

        const offersByMonthResponse = await axios.get(
          `${BASE_URL}/offers/by-month`
        );
        setPublishedOffersByMonth(offersByMonthResponse.data);

        const applicationsByMonthResponse = await axios.get(
          `${BASE_URL}/applications/by-month`
        );
        setApplicationsByMonth(applicationsByMonthResponse.data);

        const rejectedApplicationsByMonthResponse = await axios.get(
          `${BASE_URL}/applications/rejected/by-month`
        );
        setRejectedApplicationsByMonth(
          rejectedApplicationsByMonthResponse.data
        );

        const acceptedApplicationsByMonthResponse = await axios.get(
          `${BASE_URL}/applications/accepted/by-month`
        );
        setAcceptedApplicationsByMonth(
          acceptedApplicationsByMonthResponse.data
        );

        const receivedApplicationsByMonthResponse = await axios.get(
          `${BASE_URL}/applications/received/by-month`
        );
        setReceivedApplicationsByMonth(
          receivedApplicationsByMonthResponse.data
        );
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="row">
        <Card
          title="Stage publié /mois"
          value={publishedOffersByMonth.length}
          color="primary"
        />
        <Card
          title="Stage publié /An"
          value={publishedOffersByYear.length}
          color="success"
        />
        <Card
          title="Candidatures refusées /mois"
          value={rejectedApplicationsByMonth.length}
          color="warning"
        />
        <Card
          title="Candidatures acceptées /mois"
          value={acceptedApplicationsByMonth.length}
          color="info"
        />
        <Card
          title="Candidatures reçues /mois"
          value={receivedApplicationsByMonth.length}
          color="success"
        />
      </div>
      <div className="row">
        <div className="col-xl-4 col-lg-5">
          <Doughnut
            options={{
              plugins: {
                title: {
                  display: true,
                  text: "Charte des candidatures",
                },
              },
            }}
            data={{
              labels: ["Publiées", "Refusées", "Acceptées", "Reçues"],
              datasets: [
                {
                  data: [
                    applicationsByMonth.length,
                    rejectedApplicationsByMonth.length,
                    acceptedApplicationsByMonth.length,
                    receivedApplicationsByMonth.length,
                  ],
                  backgroundColor: [
                    "rgb(255, 99, 132)",
                    "rgb(54, 162, 235)",
                    "lightgreen",
                    "rgb(200, 200, 5)",
                  ],
                  hoverOffset: 4,
                },
              ],
            }}
          />
        </div>
        <div className="col-xl-8 col-lg-7">
          <Line
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Vue globale",
                },
              },
            }}
            data={{
              labels: [
                "Janvier",
                "Février",
                "Mars",
                "Avril",
                "Mai",
                "Juin",
                "Juillet",
              ],
              datasets: [
                {
                  label: "Nombre de candidatures",
                  data: applicationsByMonth.map((item) => item.count),
                  fill: false,
                  borderColor: "rgb(75, 192, 192)",
                  tension: 0.1,
                },
              ],
            }}
          />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
