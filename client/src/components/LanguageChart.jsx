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

function LanguageChart({ languages = [] }) {
  const chartLanguages = languages.slice(0, 6);

  const data = {
    labels: chartLanguages.map((item) => item.name),
    datasets: [
      {
        label: 'Language Usage %',
        data: chartLanguages.map((item) => item.percent),
        backgroundColor: ['#dd6b42', '#e79167', '#efb089', '#6f8f78', '#8eac95', '#cbd8c8'],
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
          color: '#4c5d54',
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
          color: '#6a665f',
        },
        grid: {
          color: 'rgba(112, 103, 92, 0.18)',
        },
      },
    },
  };

  return (
    <section className="panel">
      <p className="panel__eyebrow">
        Language Mix
      </p>
      <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '20px' }}>
        Language Distribution
      </h2>
      <div style={{ height: '300px' }}>
        <Bar data={data} options={options} />
      </div>
    </section>
  );
}

export default LanguageChart;
