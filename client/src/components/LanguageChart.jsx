import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '20px',
  padding: '24px',
  boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)',
};

function LanguageChart({ languages = [] }) {
  const chartLanguages = languages.slice(0, 6);

  const data = {
    labels: chartLanguages.map((item) => item.name),
    datasets: [
      {
        label: 'Language Usage %',
        data: chartLanguages.map((item) => item.percent),
        backgroundColor: ['#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
        borderRadius: 12,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#334155',
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
          color: '#64748b',
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.2)',
        },
      },
    },
  };

  return (
    <section style={cardStyle}>
      <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem' }}>
        Language Mix
      </p>
      <h2 style={{ margin: '6px 0 20px', fontSize: '1.8rem', color: '#0f172a' }}>
        Language Distribution
      </h2>
      <div style={{ height: '300px' }}>
        <Bar data={data} options={options} />
      </div>
    </section>
  );
}

export default LanguageChart;
