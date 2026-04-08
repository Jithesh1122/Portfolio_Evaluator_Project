import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  MatrixController,
  MatrixElement
);

const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '20px',
  padding: '24px',
  boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)',
};

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getFormattedHeatmapData = (heatmapData = []) => {
  const countsByDate = new Map();

  heatmapData.forEach((entry) => {
    if (!entry?.date) {
      return;
    }

    countsByDate.set(entry.date, entry.count ?? 0);
  });

  const today = new Date();
  const chartData = [];

  for (let weekIndex = 11; weekIndex >= 0; weekIndex -= 1) {
    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const date = new Date(today);
      const offset = weekIndex * 7 + (6 - dayIndex);
      date.setDate(today.getDate() - offset);

      const dateKey = date.toISOString().split('T')[0];

      chartData.push({
        x: 11 - weekIndex,
        y: dayIndex,
        v: countsByDate.get(dateKey) || 0,
        date: dateKey,
      });
    }
  }

  return chartData;
};

function HeatMap({ heatmapData = [] }) {
  const matrixData = getFormattedHeatmapData(heatmapData);

  const data = {
    datasets: [
      {
        label: 'Contribution Activity',
        data: matrixData,
        backgroundColor: (context) => {
          const value = context.dataset.data[context.dataIndex]?.v ?? 0;

          if (value >= 6) {
            return '#1d4ed8';
          }

          if (value >= 3) {
            return '#60a5fa';
          }

          if (value >= 1) {
            return '#bfdbfe';
          }

          return '#e2e8f0';
        },
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ffffff',
        width: ({ chart }) => (chart.chartArea ? chart.chartArea.width / 12 - 6 : 20),
        height: ({ chart }) => (chart.chartArea ? chart.chartArea.height / 7 - 6 : 20),
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
      tooltip: {
        callbacks: {
          title: (items) => {
            const dateValue = items[0]?.raw?.date;

            if (!dateValue) {
              return 'Activity Details';
            }

            return new Date(dateValue).toLocaleDateString();
          },
          label: (context) => `Commits/Events: ${context.raw.v}`,
        },
      },
    },
    scales: {
      x: {
        type: 'linear',
        min: -0.5,
        max: 11.5,
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        type: 'linear',
        min: -0.5,
        max: 6.5,
        reverse: true,
        ticks: {
          callback: (value) => dayLabels[value] || '',
          color: '#64748b',
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
  };

  return (
    <section style={cardStyle}>
      <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem' }}>
        Activity Pattern
      </p>
      <h2 style={{ margin: '6px 0 20px', fontSize: '1.8rem', color: '#0f172a' }}>
        Heat Map
      </h2>
      <div style={{ height: '240px' }}>
        <Chart type="matrix" data={data} options={options} />
      </div>
    </section>
  );
}

export default HeatMap;
