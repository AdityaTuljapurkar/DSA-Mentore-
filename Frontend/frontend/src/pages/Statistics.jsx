import { useState, useEffect } from "react";
import axios from "axios";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
);

export default function Statistics() {
    const [subtopicStats, setSubtopicStats] = useState({});
    const [statusStats, setStatusStats] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const accessTkn = localStorage.getItem("accessToken");

                const headers = accessTkn
                    ? { Authorization: `Bearer ${accessTkn}` }
                    : {};

                const [status, subtopic] = await Promise.all([
                    axios.get(
                        "http://127.0.0.1:8000/api/status_stats_endpoint",
                        { headers }
                    ),
                    axios.get(
                        "http://127.0.0.1:8000/api/subtopic_stats_endpoint",
                        { headers }
                    ),
                ]);

                setStatusStats(status.data);
                setSubtopicStats(subtopic.data);
            } catch (error) {
                console.error("Failed to fetch statistics:", error);
            }
        };

        fetchStats();
    }, []);

    // Solved = #3ddc97, Unsolved = #ff6b81, borderWidth: 0
    const pieData = {
        labels: ["Solved", "Unsolved"],
        datasets: [
            {
                label: "Questions",
                data: statusStats,
                backgroundColor: ["#3ddc97", "#ff6b81"],
                borderWidth: 0,
            },
        ],
    };

    // Horizontal bar filled with purple gradient #6a5cff -> #8b7bff, borderRadius: 99
    const barData = {
        labels: Object.keys(subtopicStats),
        datasets: [
            {
                label: "Questions per Subtopic",
                data: Object.values(subtopicStats),
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return "#8b7bff";
                    const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
                    gradient.addColorStop(0, "#6a5cff");
                    gradient.addColorStop(1, "#8b7bff");
                    return gradient;
                },
                borderRadius: 99,
                borderSkipped: false,
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    color: "#8a90a6",
                    font: {
                        size: 13,
                    },
                    boxWidth: 12,
                    padding: 16,
                },
            },
        },
    };

    const barOptions = {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                grid: {
                    color: "rgba(255, 255, 255, 0.06)",
                    drawBorder: false,
                },
                ticks: {
                    color: "#8a90a6",
                    precision: 0,
                },
            },
            y: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    color: "#8a90a6",
                },
            },
        },
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: Solved vs Unsolved */}
            <div className="bg-white/[0.06] border border-white/[0.12] rounded-[20px] backdrop-blur-xl backdrop-saturate-150 shadow-[0_10px_40px_rgba(0,0,0,0.35)] p-[22px]">
                <h3 className="text-[13px] font-medium text-[#8a90a6] mb-4">
                    Solved vs Unsolved
                </h3>
                <div className="h-64">
                    <Pie data={pieData} options={pieOptions} />
                </div>
            </div>

            {/* Card 2: Questions by Subtopic */}
            <div className="bg-white/[0.06] border border-white/[0.12] rounded-[20px] backdrop-blur-xl backdrop-saturate-150 shadow-[0_10px_40px_rgba(0,0,0,0.35)] p-[22px]">
                <h3 className="text-[13px] font-medium text-[#8a90a6] mb-4">
                    Questions by Subtopic
                </h3>
                <div className="h-64">
                    <Bar data={barData} options={barOptions} />
                </div>
            </div>
        </div>
    );
}