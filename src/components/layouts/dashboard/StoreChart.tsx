import React, { useMemo } from 'react';
import { ExtractionData } from '../../../types/ExtractionData';
import { Table } from 'react-bootstrap';

interface StoreChartProps {
  invoices: ExtractionData[];
}

const StoreChart: React.FC<StoreChartProps> = ({ invoices }) => {
  const storeData = useMemo(() => {
    // Group by store
    const storeAmounts: Record<string, number> = {};
    
    invoices.forEach(invoice => {
      if (!storeAmounts[invoice.storeName]) {
        storeAmounts[invoice.storeName] = 0;
      }
      // Add the totalAmount to the corresponding store
      storeAmounts[invoice.storeName] += invoice.totalAmount;
    });
    
    // Calculate total
    const total = Object.values(storeAmounts).reduce((sum, amount) => sum + amount, 0);
    
    // Sort by amount and calculate percentages
    const storeStats = Object.entries(storeAmounts).map(([name, amount]) => ({
      name,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0
    })).sort((a, b) => b.amount - a.amount);
    
    return {
      stores: storeStats,
      total
    };
  }, [invoices]);

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
          {/* Simple pie chart visualization */}
          <div className="d-flex justify-content-center mb-3">
            <div style={{ width: '200px', height: '200px', position: 'relative' }}>
              {storeData.stores.map((store, index) => {
                // Calculate the slice
                const startAngle = storeData.stores
                  .slice(0, index)
                  .reduce((sum, s) => sum + s.percentage, 0) * 3.6; // 3.6 = 360/100
                
                const endAngle = startAngle + store.percentage * 3.6;
                
                // Convert to radians for calculations
                const startRad = (startAngle - 90) * Math.PI / 180;
                const endRad = (endAngle - 90) * Math.PI / 180;
                
                // Calculate path
                const x1 = 100 + 80 * Math.cos(startRad);
                const y1 = 100 + 80 * Math.sin(startRad);
                const x2 = 100 + 80 * Math.cos(endRad);
                const y2 = 100 + 80 * Math.sin(endRad);
                
                const largeArcFlag = store.percentage > 50 ? 1 : 0;
                
                const pathData = [
                  `M 100 100`,
                  `L ${x1} ${y1}`,
                  `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                  `Z`
                ].join(' ');
                
                return (
                  <div 
                    key={store.name}
                    className="position-absolute"
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      top: 0,
                      left: 0
                    }}
                  >
                    <svg width="100%" height="100%" viewBox="0 0 200 200">
                      <path 
                        d={pathData} 
                        fill={colors[index % colors.length]} 
                        stroke="#fff" 
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                );
              })}
              
              {/* Center circle for donut chart effect */}
              <div 
                className="position-absolute bg-white rounded-circle" 
                style={{ 
                  width: '100px', 
                  height: '100px', 
                  top: '50px', 
                  left: '50px',
                  boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)'
                }}
              ></div>
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
