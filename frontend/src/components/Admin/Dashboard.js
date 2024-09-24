import React, { useEffect, useState } from "react";
import { Doughnut, Line, Bar } from "react-chartjs-2";
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
  BarElement,
} from "chart.js";
import "./sb-admin-2.min.css";

Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
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
  const [offersByDomain, setOffersByDomain] = useState([]);

  const fetchData = async () => {
    try {
      const offersByYearResponse = await axios.get(
        "http://localhost:8000/stat/offers/by-year"
      );
      setPublishedOffersByYear(offersByYearResponse.data);

      const offersByMonthResponse = await axios.get(
        "http://localhost:8000/stat/offers/by-month"
      );
      setPublishedOffersByMonth(offersByMonthResponse.data);

      const applicationsByMonthResponse = await axios.get(
        "http://localhost:8000/stat/applications/by-month"
      );
      setApplicationsByMonth(applicationsByMonthResponse.data);

      const rejectedApplicationsByMonthResponse = await axios.get(
        "http://localhost:8000/stat/applications/rejected/by-month"
      );
      setRejectedApplicationsByMonth(rejectedApplicationsByMonthResponse.data);

      const acceptedApplicationsByMonthResponse = await axios.get(
        "http://localhost:8000/stat/applications/accepted/by-month"
      );
      setAcceptedApplicationsByMonth(acceptedApplicationsByMonthResponse.data);

      const receivedApplicationsByMonthResponse = await axios.get(
        "http://localhost:8000/stat/applications/received/by-month"
      );
      setReceivedApplicationsByMonth(receivedApplicationsByMonthResponse.data);

      const offersByDomainResponse = await axios.get(
        "http://localhost:8000/stat/offers/by-domain"
      );
      console.log("Offers by Domain:", offersByDomainResponse.data); // Vérifiez les données
      setOffersByDomain(offersByDomainResponse.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log("published offers by month", publishedOffersByMonth);
    console.log("published offers by year", publishedOffersByYear);
    console.log("applications by month", applicationsByMonth);
    console.log("rejected applications by month", rejectedApplicationsByMonth);
    console.log("accepted apps by month", acceptedApplicationsByMonth);
    console.log("received apps by month", receivedApplicationsByMonth);
    console.log("offers by domain", offersByDomain);
  }, [
    publishedOffersByMonth,
    publishedOffersByYear,
    applicationsByMonth,
    rejectedApplicationsByMonth,
    acceptedApplicationsByMonth,
    receivedApplicationsByMonth,
    offersByDomain,
  ]);

  const calculateAverage = (data) => {
    if (!data || data.length === 0) return 0;
    const totalItems = data.reduce((total, current) => {
      const value = parseInt(current.split(": ")[1].split(" ")[0]);
      return total + (isNaN(value) ? 0 : value);
    }, 0);
    return Math.round(totalItems / data.length) || 0;
  };

  const averageOffersByMonth = calculateAverage(publishedOffersByMonth);
  const averageOffersByYear = calculateAverage(publishedOffersByYear);
  const averageApplicationsByMonth = calculateAverage(applicationsByMonth);
  const averageRejectedApplicationsByMonth = calculateAverage(
    rejectedApplicationsByMonth
  );
  const averageAcceptedApplicationsByMonth = calculateAverage(
    acceptedApplicationsByMonth
  );
  const averageReceivedApplicationsByMonth = calculateAverage(
    receivedApplicationsByMonth
  );

  const extractLabelsAndData = (data) => {
    if (!data || data.length === 0)
      return { labels: ["Aucun domaine"], values: [0] };

    const labels = [];
    const values = [];

    data.forEach((item) => {
      const parts = item.split(": ");
      if (parts.length === 2) {
        const domain = parts[0];
        const count = parseInt(parts[1].split(" ")[0], 10);
        labels.push(domain);
        values.push(isNaN(count) ? 0 : count);
      }
    });

    return { labels, values };
  };

  // Préparer les données pour le graphique des candidatures reçues
  const { labels: receivedLabels, values: receivedValues } =
    extractLabelsAndData(receivedApplicationsByMonth);

  // Préparer les données pour le graphique des domaines
  const { labels: domainLabels, values: domainValues } =
    extractLabelsAndData(offersByDomain);

  return (
    <>
      <div className="row">
        <Card
          title="Stage publié /mois"
          value={averageOffersByMonth}
          color="primary"
        />
        <Card
          title="Stage publié /An"
          value={averageOffersByYear}
          color="success"
        />
        <Card
          title="Candidatures refusées /mois"
          value={averageRejectedApplicationsByMonth}
          color="warning"
        />
        <Card
          title="Candidatures acceptées /mois"
          value={averageAcceptedApplicationsByMonth}
          color="info"
        />
        <Card
          title="Candidatures reçues /mois"
          value={averageReceivedApplicationsByMonth}
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
              labels: ["Refusées", "Acceptées", "Reçues"],
              datasets: [
                {
                  data: [
                    averageRejectedApplicationsByMonth,
                    averageAcceptedApplicationsByMonth,
                    averageReceivedApplicationsByMonth,
                  ],
                  backgroundColor: [
                    "rgb(255, 99, 132)",
                    "lightgreen",
                    "rgb(54, 162, 235)",
                  ],
                  hoverOffset: 3,
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
              labels: receivedLabels, // Assurez-vous que receivedLabels est défini ici
              datasets: [
                {
                  label: "Nombre de candidatures reçues",
                  data: receivedValues, // Assurez-vous que receivedValues est défini ici
                  fill: false,
                  borderColor: "rgb(75, 192, 192)",
                  tension: 0.1,
                },
              ],
            }}
          />
        </div>
        <div className="col-xl-12">
          <Bar
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Nombre de stages par domaine",
                },
              },
            }}
            data={{
              labels: domainLabels, // Assurez-vous que domainLabels est défini ici
              datasets: [
                {
                  label: "Nombre de stages",
                  data: domainValues, // Assurez-vous que domainValues est défini ici
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                  borderColor: "rgb(75, 192, 192)",
                  borderWidth: 1,
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
