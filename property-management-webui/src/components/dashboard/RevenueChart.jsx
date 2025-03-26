import React from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
);

const RevenueChart = ({ data = [] }) => {
  // If no data is provided, use sample data
  const chartData = data.length > 0 ? data : [
    { month: 'Jan', revenue: 5800 },
    { month: 'Feb', revenue: 6200 },
    { month: 'Mar', revenue: 7100 },
    { month: 'Apr', revenue: 6700 },
    { month: 'May', revenue: 8300 },
    { month: 'Jun', revenue: 9200 },
    { month: 'Jul', revenue: 10100 },
    { month: 'Aug', revenue: 10800 },
    { month: 'Sep', revenue: 9500 },
    { month: 'Oct', revenue: 8500 },
    { month: 'Nov', revenue: 7800 },
    { month: 'Dec', revenue: 8800 }
  ];

  const chartConfig = {
    labels: chartData.map(item => item.month),
    datasets: [
      {
        label: 'Revenue (£)',
        data: chartData.map(item => item.revenue),
        fill: {
          target: 'origin',
          above: 'rgba(78, 115, 223, 0.05)'
        },
        borderColor: 'rgba(78, 115, 223, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(78, 115, 223, 1)',
        pointBorderColor: '#fff',
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(78, 115, 223, 1)',
        pointHoverBorderColor: '#fff',
        tension: 0.3
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgb(255, 255, 255)',
        bodyColor: '#858796',
        titleMarginBottom: 10,
        titleColor: '#6e707e',
        titleFontSize: 14,
        borderColor: '#dddfeb',
        borderWidth: 1,
        padding: 15,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `£${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgb(234, 236, 244)',
          zeroLineColor: 'rgb(234, 236, 244)',
          drawBorder: false
        },
        ticks: {
          callback: function(value) {
            return '£' + value.toLocaleString();
          }
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false
        }
      }
    }
  };

  return (
    <div style={{ position: 'relative', height: '320px' }}>
      <Line data={chartConfig} options={options} />
    </div>
  );
};

export default RevenueChart;