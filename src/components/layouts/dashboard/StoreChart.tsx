import React, { useMemo } from 'react';
import { Table } from 'react-bootstrap';
import { MarketShareResponse } from '../../../api/statisticsApi';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface StoreChartProps {
  data: MarketShareResponse;
}

const StoreChart: React.FC<StoreChartProps> = ({ data }) => {
  const storeData = useMemo(() => {
    if (!data || !data.data || data.data.length === 0) {
      return {
        stores: [],
        total: 0
      };
    }

    // Calculate total for percentage calculation
    const totalPercentage = data.data.reduce((sum, store) => sum + store.marketShare, 0);
    
    // Sort by market share and format the data
    const storeStats = [...data.data]
      .map(store => ({
        name: store.name,
        percentage: store.marketShare,
        amount: (store.marketShare / 100) * totalPercentage // This is just a relative value
      }))
      .sort((a, b) => b.percentage - a.percentage);
    
    return {
      stores: storeStats,
      total: totalPercentage
    };
  }, [data]);

  // Colors for the chart
  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
  ];

  return (
    <div className="store-chart">
      {storeData.stores.length === 0 ? (
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
                  <td className="text-end">{store.amount.toFixed(2)} VNĐ</td>
                  <td className="text-end">{store.percentage.toFixed(1)}%</td>
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
                    {storeData.stores.slice(5).reduce((sum, store) => sum + store.amount, 0).toFixed(2)} VNĐ
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
