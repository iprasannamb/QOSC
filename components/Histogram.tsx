import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface HistogramProps {
  results: { [key: string]: number };
}

const Histogram: React.FC<HistogramProps> = ({ results }) => {
  const labels = Object.keys(results);
  const dataValues = Object.values(results);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Measurement Results',
        data: dataValues,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.raw;
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Qubit States',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Counts',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="mt-4">
      <h3 className="text-xl mb-2">Measurement Histogram</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default Histogram; 