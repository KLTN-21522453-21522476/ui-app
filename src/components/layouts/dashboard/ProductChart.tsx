import React, { useState } from 'react';
import { Card, Button, ButtonGroup, Spinner, Alert } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartOptions } from 'chart.js';
import { mockProductChartData } from '../../../mock/mockData';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type TimeRange = '7days' | '30days' | '90days' | 'year';

const timeRangeOptions: { label: string; value: TimeRange }[] = [
  { label: '7 ngày', value: '7days' },
  { label: '30 ngày', value: '30days' },
  { label: '90 ngày', value: '90days' },
  { label: '1 năm', value: 'year' },
];

const barColors = [
  '#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f', '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'
];

const ProductChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30days');
  const [loading, setLoading] = useState(false);

  // Simulate data fetch delay
  // setLoading(true); setTimeout(() => setLoading(false), 1000);

  // Use mock data
  const data = mockProductChartData;

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: data.datasets[0].label,
        data: data.datasets[0].data,
        backgroundColor: data.labels.map((_, idx) => barColors[idx % barColors.length]),
        hoverBackgroundColor: data.labels.map((_, idx) => barColors[(idx + 1) % barColors.length]),
        borderRadius: 6,
        maxBarThickness: 40,
      },
    ],
  };

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        title: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.05)',
        },
        title: {
          display: false,
        },
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const hasData = data.labels && data.labels.length > 0 && data.datasets[0].data.length > 0;

  return (
    <div className="h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <h5 className="mb-0">Top 5 sản phẩm bán chạy</h5>
          <ButtonGroup>
            {timeRangeOptions.map(option => (
              <Button
                key={option.value}
                variant={timeRange === option.value ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => setTimeRange(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </ButtonGroup>
        </div>
        <div className="mb-2 text-muted small">
          Date range: {data.timeRange.start_date} – {data.timeRange.end_date}
        </div>
        <div style={{ flex: 1, minHeight: 240 }}>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: 250 }}>
              <Spinner animation="border" variant="primary" />
            </div>
          ) : hasData ? (
            <Bar data={chartData} options={chartOptions} height={300} />
          ) : (
            <Alert variant="info" className="text-center my-5">
              No data available for this time period
            </Alert>
          )}
        </div>
    </div>
  );
};

export default ProductChart;
