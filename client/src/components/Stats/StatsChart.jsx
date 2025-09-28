// components/Stats/StatsChart.jsx
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useStats } from "../../api/hooks.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function StatsChart() {
  const { data, isLoading } = useStats();

  if (isLoading) return <div>Loading chart...</div>;

  const letters = ["r", "i", "m", "e", "s"];
  const counts = letters.map((letter) => data?.letters?.[letter] || 0);

  const chartData = {
    labels: letters.map((l) => l.toUpperCase()),
    datasets: [
      {
        label: "Letter Frequency",
        data: counts,
        backgroundColor: "rgba(30, 64, 175, 0.8)",
        borderColor: "rgba(30, 64, 175, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Letter Frequency in All Articles (R, I, M, E, S)",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
