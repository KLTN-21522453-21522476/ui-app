import React, { useEffect, useMemo } from 'react';
import { Table, Card, Spinner, Alert } from 'react-bootstrap';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useStatistic } from '../../../hooks/useStatistic';

ChartJS.register(ArcElement, Tooltip, Legend);

interface StoreChartProps {
  group_id: string;
}

const StoreChart: React.FC<StoreChartProps> = ({ group_id }) => {
  if (!group_id){
    console.log("StoreChart: group_id is not set")
    return (
      <div className="h-100 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
          <h5 className="mb-0">Biểu đồ các cửa hàng</h5>
        </div>
        <div style={{ flex: 1, minHeight: 240 }}>
          <Alert variant="info" className="text-center my-5">
            Không có dữ liệu
          </Alert>
        </div>
      </div>
    )
  }
  const { marketShare, loading, error, getMarketShare } = useStatistic();

  useEffect(() => {
    if (group_id) {
      getMarketShare({ group_id });
    }
  }, [group_id, getMarketShare]);

  const data = marketShare;

  const storeData = useMemo(() => {
    if (!data || !data.data || data.data.length === 0) {
      return {
        stores: [],
        total: 0
      };
    }

    // Use new API fields: amount, percentage, store
    const totalAmount = data.data.reduce((sum, store) => sum + (store.amount || 0), 0);

    // Sort by percentage and format the data
    const storeStats = [...data.data]
      .map(store => ({
        name: store.store,
        percentage: typeof store.percentage === 'number' ? store.percentage : 0,
        amount: typeof store.amount === 'number' ? store.amount : 0
      }))
      .sort((a, b) => b.percentage - a.percentage);

    return {
      stores: storeStats,
      total: totalAmount
    };
  }, [data]);

  // Colors for the chart
  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
  ];

  return (
    <div className="store-chart">
      <Card.Header className="bg-white">
        <h5 className="mb-0">Biểu đồ các cửa hàng</h5>
      </Card.Header>
      {error ? (
        <Alert variant="danger" className="text-center my-4">{error}</Alert>
      ) : loading ? (
        <div className="d-flex justify-content-center align-items-center my-5" style={{ height: 240 }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : storeData.stores.length === 0 ? (
        <p className="text-center">No store data available</p>
      ) : (
        <>
          <div className="d-flex justify-content-center mb-3">
            <div style={{ width: '240px', height: '240px' }}>
              <Pie
                data={{
                  labels: storeData.stores.map(store => store.name),
                  datasets: [
                    {
                      data: storeData.stores.map(store => store.percentage),
                      backgroundColor: colors,
                      borderColor: '#fff',
                      borderWidth: 2,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.parsed || 0;
                          return `${label}: ${value.toFixed(1)}%`;
                        }
                      }
                    }
                  },
                  cutout: '60%',
                  responsive: true,
                  maintainAspectRatio: false,
                }}
                width={240}
                height={240}
              />
            </div>
          </div>
          
          {/* Legend */}
          <Table size="sm" className="mt-3">
            <tbody>
              {storeData.stores.slice(0, 5).map((store, index) => (
                <tr key={store.name}>
                  <td width="20">
                    <span 
                      className="d-inline-block"
                      style={{ 
                        width: '12px', 
                        height: '12px', 
                        backgroundColor: colors[index % colors.length],
                        borderRadius: '2px'
                      }}
                    ></span>
                  </td>
                  <td>{store.name}</td>
                  <td className="text-end">{typeof store.amount === 'number' ? store.amount.toLocaleString('vi-VN', { minimumFractionDigits: 0 }) : '-'} VNĐ</td>
                  <td className="text-end">{typeof store.percentage === 'number' ? store.percentage.toFixed(1) : '-'}%</td>
                </tr>
              ))}
              
              {storeData.stores.length > 5 && (
                <tr>
                  <td>
                    <span 
                      className="d-inline-block"
                      style={{ 
                        width: '12px', 
                        height: '12px', 
                        backgroundColor: colors[5],
                        borderRadius: '2px'
                      }}
                    ></span>
                  </td>
                  <td>Others</td>
                  <td className="text-end">
                    {storeData.stores.slice(5).reduce((sum, store) => sum + store.amount, 0).toFixed(0)} VNĐ
                  </td>
                  <td className="text-end">
                    {storeData.stores.slice(5).reduce((sum, store) => sum + store.percentage, 0).toFixed(1)}%
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
};

export default StoreChart;
