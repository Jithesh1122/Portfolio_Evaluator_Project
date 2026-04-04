import {
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '20px',
  padding: '24px',
  boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)',
};

const defaultScores = {
  activity: { score: 0 },
  codeQuality: { score: 0 },
  diversity: { score: 0 },
  community: { score: 0 },
};

function RadarChart({ scores = defaultScores }) {
  const data = {
    labels: ['Activity', 'Code Quality', 'Diversity', 'Community'],
    datasets: [
      {
        label: 'Portfolio Scores',
        data: [
          scores.activity?.score ?? 0,
          scores.codeQuality?.score ?? 0,
          scores.diversity?.score ?? 0,
          scores.community?.score ?? 0,
        ],
        backgroundColor: 'rgba(37, 99, 235, 0.18)',
        borderColor: '#2563eb',
        borderWidth: 2,
        pointBackgroundColor: '#1d4ed8',
        pointBorderColor: '#ffffff',
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: '#1d4ed8',
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
      r: {
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20,
          backdropColor: 'transparent',
          color: '#64748b',
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.35)',
        },
        angleLines: {
          color: 'rgba(148, 163, 184, 0.25)',
        },
        pointLabels: {
          color: '#0f172a',
          font: {
            size: 13,
          },
        },
      },
    },
  };

  return (
    <section style={cardStyle}>
      <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem' }}>
        Visual Score Snapshot
      </p>
      <h2 style={{ margin: '6px 0 20px', fontSize: '1.8rem', color: '#0f172a' }}>
        Radar Analysis
      </h2>
      <div style={{ height: '320px' }}>
        <Radar data={data} options={options} />
      </div>
    </section>
  );
}

export default RadarChart;
