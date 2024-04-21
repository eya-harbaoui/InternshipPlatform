import React from 'react'
import { Doughnut, Line } from 'react-chartjs-2'
import Card from './Card'
import {
    Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Colors
} from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

function Dashboard() {
    return (
        <>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
                <a href="#" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
                    <FontAwesomeIcon icon={faDownload} style={{ marginRight: "0.25rem", color: "white" }} />
                    Generer un rapport
                </a>
            </div>
            <div className="row">
                <Card title="Stage publié /mois" value="7" color="primary" />
                <Card title="Stage publié /An" value="30" color="success" />
                <Card title="Candidatures refusés/mois" value="20" color="warning" />
                <Card title="Candidatures acceptés /mois" value="6" color="info" />
                <Card title="Candidatures reçus /mois" value="26" color="custom" />

            </div>
            <div className='row'>
                <div className='col-xl-4 col-lg-5'>
                    <Doughnut
                        options={{
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Charte des candidatures'
                                }
                            }
                        }}
                        data={{
                            labels: [
                                'Publiéss',
                                'Refusées',
                                'Acceptées',
                                'Reçus'
                            ],
                            datasets: [{
                                data: [37, 20, 6,26],
                                backgroundColor: [
                                    'rgb(255, 99, 132)',
                                    'rgb(54, 162, 235)',
                                    'lightgreen',
                                    'rgb(200, 200, 5)'
                                ],
                                hoverOffset: 4
                            }]
                        }}
                    />
                </div>
                <div className='col-xl-8 col-lg-7'>
                    <Line options={{
                        responsive: true,
                        plugins: {
                            legend:
                            {
                                position: 'top',
                            },
                            title:
                            {
                                display: true,
                                text: 'Vue globale',
                            },
                        },
                    }}
                        data={{
                            labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet'],
                            datasets: [{
                                label: 'Nombre de candidatures',
                                data: [0, 5, 10, 15, 20, 25, 30],
                                fill: false,
                                borderColor: 'rgb(75, 192, 192)',
                                tension: 0.1
                            }]
                        }}
                    />;
                </div>
            </div>
        </>
    )
}

export default Dashboard