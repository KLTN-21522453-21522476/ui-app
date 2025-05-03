import React, { useMemo } from 'react';
import { InvoiceData } from '../../../types/Invoice';

interface ProductChartProps {
  invoices: InvoiceData[];
}

const ProductChart: React.FC<ProductChartProps> = ({ invoices }) => {
  const chartData = useMemo(() => {
    // Group invoices by month
    const monthlyData: Record<string, { products: number; amount: number }> = {};
    
    invoices.forEach(invoice => {
      // Ensure createdDate is valid
      if (!invoice.createdDate) return;
      
      try {
        const date = new Date(invoice.createdDate);
        if (isNaN(date.getTime())) return; // Skip invalid dates
        
        const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        
        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = { products: 0, amount: 0 };
        }
        
        // Count products
        if (invoice.items && Array.isArray(invoice.items)) {
          monthlyData[monthYear].products += invoice.items.length;
        }
        
        // Add total amount
        if (typeof invoice.totalAmount === 'number') {
          monthlyData[monthYear].amount += invoice.totalAmount;
        }
      } catch (error) {
        console.error("Error processing invoice date:", error);
      }
    });
    
    // Sort months chronologically
    const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
      const [monthA, yearA] = a.split(' ');
      const [monthB, yearB] = b.split(' ');
      
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      if (yearA !== yearB) {
        return parseInt(yearA) - parseInt(yearB);
      }
      
      return monthNames.indexOf(monthA) - monthNames.indexOf(monthB);
    });
    
    return {
      labels: sortedMonths,
      products: sortedMonths.map(month => monthlyData[month].products),
      amounts: sortedMonths.map(month => monthlyData[month].amount),
    };
  }, [invoices]);

  // Calculate max values for scaling (with fallbacks to prevent zero division)
  const maxProducts = Math.max(...chartData.products, 1);
  const maxAmount = Math.max(...chartData.amounts, 1);

  // Check if we have data to display
  const hasData = chartData.labels.length > 0;

  return (
    <div className="chart-container" style={{ height: '350px', position: 'relative' }}>
      <div className="text-center mb-3">
        <span className="me-3"><span className="badge bg-primary">■</span> Sản phẩm</span>
        <span><span className="badge bg-info">■</span> Tổng tiền (VNĐ)</span>
      </div>
      
      {!hasData ? (
        <div className="d-flex justify-content-center align-items-center h-75">
          <p className="text-muted">Không có dữ liệu để hiển thị</p>
        </div>
      ) : (
        <div className="d-flex h-100">
          {/* Y-axis labels (Products) */}
          <div className="d-flex flex-column justify-content-between pe-2" style={{ width: '50px' }}>
            <div className="text-end small text-muted">{maxProducts}</div>
            <div className="text-end small text-muted">{Math.floor(maxProducts * 0.75)}</div>
            <div className="text-end small text-muted">{Math.floor(maxProducts * 0.5)}</div>
            <div className="text-end small text-muted">{Math.floor(maxProducts * 0.25)}</div>
            <div className="text-end small text-muted">0</div>
          </div>
          
          {/* Chart area */}
          <div className="flex-grow-1">
            <div className="h-100 d-flex align-items-end position-relative">
              {/* Horizontal grid lines */}
              <div className="position-absolute w-100 h-100">
                <div className="border-top position-absolute w-100" style={{ top: '0%' }}></div>
                <div className="border-top position-absolute w-100" style={{ top: '25%' }}></div>
                <div className="border-top position-absolute w-100" style={{ top: '50%' }}></div>
                <div className="border-top position-absolute w-100" style={{ top: '75%' }}></div>
                <div className="border-top position-absolute w-100" style={{ top: '100%' }}></div>
              </div>
              
              {/* Bars */}
              <div className="d-flex justify-content-around align-items-end w-100 h-100">
                {chartData.labels.map((month, index) => (
                  <div key={month} className="d-flex flex-column align-items-center" style={{ width: `${100 / chartData.labels.length}%` }}>
                    <div className="d-flex w-100 justify-content-center" style={{ height: '85%' }}>
                      {/* Products bar */}
                      <div 
                        className="bg-primary me-1" 
                        style={{ 
                          width: '30%', 
                          height: `${(chartData.products[index] / maxProducts) * 100}%`,
                          transition: 'height 0.5s',
                          minHeight: chartData.products[index] > 0 ? '5px' : '0'
                        }}
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title={`${chartData.products[index]} sản phẩm`}
                      ></div>
                      
                      {/* Amount bar */}
                      <div 
                        className="bg-info" 
                        style={{ 
                          width: '30%', 
                          height: `${(chartData.amounts[index] / maxAmount) * 100}%`,
                          transition: 'height 0.5s',
                          minHeight: chartData.amounts[index] > 0 ? '5px' : '0'
                        }}
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title={`${chartData.amounts[index].toLocaleString()} VNĐ`}
                      ></div>
                    </div>
                    
                    {/* X-axis label */}
                    <div className="text-muted small mt-2" style={{ fontSize: '0.7rem' }}>
                      {month}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Y-axis (Amount) */}
          <div className="d-flex flex-column justify-content-between ps-2" style={{ width: '80px' }}>
            <div className="text-start small text-muted">{maxAmount.toLocaleString()} VNĐ</div>
            <div className="text-start small text-muted">{Math.floor(maxAmount * 0.75).toLocaleString()} VNĐ</div>
            <div className="text-start small text-muted">{Math.floor(maxAmount * 0.5).toLocaleString()} VNĐ</div>
            <div className="text-start small text-muted">{Math.floor(maxAmount * 0.25).toLocaleString()} VNĐ</div>
            <div className="text-start small text-muted">0 VNĐ</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductChart;
