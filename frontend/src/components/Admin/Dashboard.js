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
  }, [
    publishedOffersByMonth,
    publishedOffersByYear,
    applicationsByMonth,
    rejectedApplicationsByMonth,
    acceptedApplicationsByMonth,
    receivedApplicationsByMonth,
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
    if (!data || data.length === 0) return { labels: [], values: [] };
    const labels = data.map((item) => item.split(": ")[0]);
    const values = data.map((item) => {
      const value = parseInt(item.split(": ")[1].split(" ")[0]);
      return isNaN(value) ? 0 : value;
    });
    return { labels, values };
  };

  const { labels, values: receivedValues } = extractLabelsAndData(
    receivedApplicationsByMonth
  );

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
              labels: labels,
              datasets: [
                {
                  label: "Nombre de candidatures reçues",
                  data: receivedValues,
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
