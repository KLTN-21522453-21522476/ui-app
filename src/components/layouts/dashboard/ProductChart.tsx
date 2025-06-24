import React, {  useEffect } from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartOptions } from 'chart.js';
import { useStatistic } from '../../../hooks/useStatistic';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const barColors = [
  '#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f', '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'
];

const ProductChart: React.FC<{ group_id: string }> = ({ group_id }) => {

  if (!group_id){
    console.log("ProductChart: group_id is not set")
    return (
      <div className="h-100 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
          <h5 className="mb-0">Top 5 sản phẩm bán chạy</h5>
        </div>
        <div style={{ flex: 1, minHeight: 240 }}>
          <Alert variant="info" className="text-center my-5">
            Không có dữ liệu
          </Alert>
        </div>
      </div>
    )
  }
  
  const { topProducts, loading, error, getTopProducts } = useStatistic();

  const now = new Date();
  let start_date = new Date(now);
  let end_date = new Date(now);
  start_date.setDate(now.getDate() - 30);

  useEffect(() => {
    getTopProducts({
      group_id,
      start_date: start_date.toISOString().slice(0, 10),
      end_date: end_date.toISOString().slice(0, 10),
      limit: 5,
    });
  }, [group_id]);

  // Prepare chart data from Redux
  const chartData = (topProducts 
    && Array.isArray(topProducts.labels)
    && Array.isArray(topProducts.datasets)
    && topProducts.datasets[0])
    ? {
        labels: topProducts.labels,
        datasets: [
          {
            label: topProducts.datasets[0].label || '',
            data: topProducts.datasets[0].data || [],
            backgroundColor: topProducts.labels.map((_: string, idx: number) => barColors[idx % barColors.length]),
            hoverBackgroundColor: topProducts.labels.map((_: string, idx: number) => barColors[(idx + 1) % barColors.length]),
            borderRadius: 6,
            maxBarThickness: 40,
          },
        ],
      }
    : {
        labels: [],
        datasets: [],
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

  const hasData = topProducts && topProducts.labels && topProducts.labels.length > 0 && topProducts.datasets[0]?.data.length > 0;

  return (
    <div className="h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <h5 className="mb-0">Top 5 sản phẩm bán chạy</h5>
      </div>
      <div className="mb-2 text-muted small">
        Date range: {topProducts?.timeRange?.start_date ?? '-'} – {topProducts?.timeRange?.end_date ?? '-'}
      </div>
      <div style={{ flex: 1, minHeight: 240 }}>
        {error ? (
          <Alert variant="danger" className="text-center my-5">{error}</Alert>
        ) : loading ? (
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
