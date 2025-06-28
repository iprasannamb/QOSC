import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface MeasurementHistogramProps {
  results: { [key: number]: number };
}

const MeasurementHistogram: React.FC<MeasurementHistogramProps> = ({ results }) => {
  // Calculate number of qubits based on the highest state
  const numQubits = Object.keys(results).length > 0 
    ? Math.max(Math.log2(Math.max(...Object.keys(results).map(k => parseInt(k.toString())))), 1)
    : 1;
    
  // Format labels as quantum states |000⟩, |001⟩, etc.
  const labels = Object.keys(results).map(key => 
    `|${parseInt(key).toString(2).padStart(numQubits, '0')}⟩`
  );
  
  const dataValues = Object.values(results);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Measurement Probability',
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
            return `${label}: ${(value * 100).toFixed(2)}%`;
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
          text: 'Probability',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="mt-6 bg-gray-800 p-4 rounded-lg">
      <h3 className="text-xl mb-4 text-gray-100">Measurement Histogram</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default MeasurementHistogram;
