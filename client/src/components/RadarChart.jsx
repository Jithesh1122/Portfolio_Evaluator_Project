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

const defaultScores = {
  activity: { score: 0 },
  codeQuality: { score: 0 },
  diversity: { score: 0 },
  community: { score: 0 },
};

function RadarChart({ scores = defaultScores, compareScores, labels = ['Portfolio Scores'] }) {
  const datasets = [
    {
      label: labels[0],
      data: [
        scores.activity?.score ?? 0,
        scores.codeQuality?.score ?? 0,
        scores.diversity?.score ?? 0,
        scores.community?.score ?? 0,
        scores.hiringReadiness?.score ?? 0,
      ],
      backgroundColor: 'rgba(221, 107, 66, 0.16)',
      borderColor: '#dd6b42',
      borderWidth: 2,
      pointBackgroundColor: '#bb4b25',
      pointBorderColor: '#fff9f3',
      pointHoverBackgroundColor: '#fff9f3',
      pointHoverBorderColor: '#bb4b25',
    },
  ];

  if (compareScores) {
    datasets.push({
      label: labels[1] || 'Compared Portfolio',
      data: [
        compareScores.activity?.score ?? 0,
        compareScores.codeQuality?.score ?? 0,
        compareScores.diversity?.score ?? 0,
        compareScores.community?.score ?? 0,
        compareScores.hiringReadiness?.score ?? 0,
      ],
      backgroundColor: 'rgba(16, 185, 129, 0.16)',
      borderColor: '#059669',
      borderWidth: 2,
      pointBackgroundColor: '#059669',
      pointBorderColor: '#ffffff',
      pointHoverBackgroundColor: '#ffffff',
      pointHoverBorderColor: '#059669',
    });
  }

  const data = {
    labels: ['Activity', 'Code Quality', 'Diversity', 'Community', 'Hiring Readiness'],
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
      plugins: {
        legend: {
          display: Boolean(compareScores),
          labels: {
          color: '#5f6c64',
        },
      },
    },
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20,
          backdropColor: 'transparent',
          color: '#7a756f',
        },
        grid: {
          color: 'rgba(112, 103, 92, 0.25)',
        },
        angleLines: {
          color: 'rgba(112, 103, 92, 0.18)',
        },
        pointLabels: {
          color: '#16211d',
          font: {
            size: 13,
          },
        },
      },
    },
  };

  return (
    <section className="panel">
      <p className="panel__eyebrow">
        Visual Score Snapshot
      </p>
      <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '20px' }}>
        Radar Analysis
      </h2>
      <div style={{ height: '320px' }}>
        <Radar data={data} options={options} />
      </div>
    </section>
  );
}

export default RadarChart;
