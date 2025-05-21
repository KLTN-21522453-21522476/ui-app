import React, { useMemo, useEffect, useState } from 'react';
import { TopProductsResponse, TopProductsParams } from '../../../api/statisticsApi';
import { statisticsApi } from '../../../api/statisticsApi';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Button, ButtonGroup, Dropdown, Card } from 'react-bootstrap';

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface ProductChartProps {
  groupId: string;
}

type TimeRange = '7days' | '30days' | '90days' | 'year';

const ProductChart: React.FC<ProductChartProps> = ({ groupId }) => {
  const [topProductsData, setTopProductsData] = useState<TopProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('30days');
  
  // Chart options
  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value.toLocaleString()} VNĐ`;
          }
        }
      }
    },
    scales: {
  y: {
    beginAtZero: true,
    ticks: {
  callback: function (tickValue: string | number): string {
    const value = typeof tickValue === 'number' ? tickValue : parseFloat(tickValue);
    return value.toLocaleString() + ' VNĐ';
  }
},
    grid: {
      display: true,
      color: 'rgba(0, 0, 0, 0.1)'
    },
    border: {
      display: true // hoặc false nếu muốn ẩn đường viền trục Y
    }
  },
  x: {
    grid: {},
    border: {
      display: false
    }
  }
}

  };

  // Generate date range based on selected time period
  const getDateRange = (range: TimeRange): { startDate: string, endDate: string } => {
    const today = new Date();
    let startDate = new Date();
    
    switch (range) {
      case '7days':
        startDate.setDate(today.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(today.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(today.getDate() - 90);
        break;
      case 'year':
        startDate.setFullYear(today.getFullYear() - 1);
        break;
    }
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    };
  };

  // Fetch data when timeRange or groupId changes
  useEffect(() => {
    const fetchTopProducts = async () => {
      setLoading(true);
      try {
        const { startDate, endDate } = getDateRange(timeRange);
        
        const response = await statisticsApi.getTopProducts({
          group_id: groupId,
          start_date: startDate,
          end_date: endDate,
          limit: 5
        });
        setTopProductsData(response);
      } catch (error) {
        console.error('Error fetching top products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, [groupId, timeRange]);

  // Create chart data from the API response
  const chartData = useMemo(() => {
    if (!topProductsData) return null;

    // Get the last dataset (latest time period)
    const latestDataset = topProductsData.datasets[topProductsData.datasets.length - 1];
    
    // Create chart data structure with better colors
    return {
      labels: topProductsData.labels,
      datasets: [
        {
          label: 'Số lượng',
          data: latestDataset.data,
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 99, 132, 0.7)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1,
          hoverBorderWidth: 3,
          hoverBorderColor: 'rgba(0, 0, 0, 0.5)'
        }
      ]
    };
  }, [topProductsData]);

  // Get time range display text
  const getTimeRangeText = (range: TimeRange): string => {
    switch (range) {
      case '7days':
        return '7 ngày qua';
      case '30days':
        return '30 ngày qua';
      case '90days':
        return '90 ngày qua';
      case 'year':
        return '1 năm qua';
      default:
        return '30 ngày qua';
    }
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Top 5 Sản phẩm bán chạy</h5>
          <ButtonGroup>
            <Button 
              variant={timeRange === '7days' ? 'primary' : 'outline-primary'} 
              size="sm"
              onClick={() => setTimeRange('7days')}
            >
              7 ngày
            </Button>
            <Button 
              variant={timeRange === '30days' ? 'primary' : 'outline-primary'} 
              size="sm"
              onClick={() => setTimeRange('30days')}
            >
              30 ngày
            </Button>
            <Button 
              variant={timeRange === '90days' ? 'primary' : 'outline-primary'} 
              size="sm"
              onClick={() => setTimeRange('90days')}
            >
              90 ngày
            </Button>
            <Button 
              variant={timeRange === 'year' ? 'primary' : 'outline-primary'} 
              size="sm"
              onClick={() => setTimeRange('year')}
            >
              1 năm
            </Button>
          </ButtonGroup>
        </div>
        
        {topProductsData && (
          <div className="text-muted small mb-3">
            {topProductsData.timeRange.start_date} đến {topProductsData.timeRange.end_date}
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            {!chartData || !topProductsData ? (
              <div className="text-center py-5">
                <p>Không có dữ liệu trong khoảng thời gian này</p>
              </div>
            ) : (
              <div style={{ height: '300px' }}>
                <Bar 
                  data={chartData} 
                  options={chartOptions} 
                />
              </div>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProductChart;
