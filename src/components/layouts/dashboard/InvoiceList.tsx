import React, { useState } from 'react';
import { InputAdornment, TextField, Box, Typography, MenuItem } from '@mui/material';
import PaginationControls from './PaginationControls';
import SearchIcon from '@mui/icons-material/Search';
import InvoiceCard from './InvoiceCard';
import { useInvoices } from '../../../hooks/useInvoices';
import type { InvoiceList } from '../../../types/InvoiceList';

interface InvoiceListProps {
  groupId: string;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sortBy: 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc' | 'status';
  setSortBy: (value: 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc' | 'status') => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ groupId, searchTerm, setSearchTerm, sortBy, setSortBy }) => {
  const [expandedInvoiceIds, setExpandedInvoiceIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const {
    invoices = [],
    isLoadingList,
    isLoadingDetail,
    error,
    rejectInvoice,
    deleteInvoice,
    approveInvoice,
    fetchInvoiceDetail,
    invoiceDetails
  } = useInvoices(groupId);

  console.log('invoices from InvoieList: ', invoices);

  const filteredInvoices = (invoices || []).filter((invoice: InvoiceList) =>
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.store_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.created_date_formatted.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    switch (sortBy) {
      case 'date_asc':
        return new Date(a.created_date_formatted.split(' ')[0].split('/').reverse().join('-')).getTime() - new Date(b.created_date_formatted.split(' ')[0].split('/').reverse().join('-')).getTime();
      case 'date_desc':
        return new Date(b.created_date_formatted.split(' ')[0].split('/').reverse().join('-')).getTime() - new Date(a.created_date_formatted.split(' ')[0].split('/').reverse().join('-')).getTime();
      case 'amount_asc':
        return Number(a.total_amount) - Number(b.total_amount);
      case 'amount_desc':
        return Number(b.total_amount) - Number(a.total_amount);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  // Pagination logic
  const pageCount = Math.ceil(sortedInvoices.length / rowsPerPage);
  const paginatedInvoices = sortedInvoices.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  console.log('filteredInvoices:', filteredInvoices);
  console.log('sortedInvoices:', sortedInvoices);
  console.log('paginatedInvoices:', paginatedInvoices);


  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setPage(1); // Reset to first page when rows per page changes
  };


  const toggleInvoiceExpand = (id: string) => {
    setExpandedInvoiceIds(
      prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };


  const getLoadingState = (invoiceId: string) => {
    if (typeof isLoadingDetail === 'boolean') {
      return expandedInvoiceIds.includes(invoiceId) && isLoadingDetail;
    } else if (typeof isLoadingDetail === 'object' && isLoadingDetail !== null) {
      return expandedInvoiceIds.includes(invoiceId) && (isLoadingDetail[invoiceId] || false);
    }
    return false;
  };

  if (isLoadingList && invoices.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography>Đang tải hóa đơn...</Typography>
      </Box>
    );
  }  

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography color="error">Lỗi khi tải hóa đơn: {String(error)}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%',
      width: '100%'
    }}>
      {/* Title and filter controls */}
      <Box 
        px={2} 
        py={2} 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 3,
          backgroundColor: 'white',
        }}
      >
        <Typography variant="h6">Hoá đơn gần đây</Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            select
            label="Sắp xếp"
            size="small"
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="date_desc">Ngày mới nhất</MenuItem>
            <MenuItem value="date_asc">Ngày cũ nhất</MenuItem>
            <MenuItem value="amount_desc">Tổng tiền cao nhất</MenuItem>
            <MenuItem value="amount_asc">Tổng tiền thấp nhất</MenuItem>
            <MenuItem value="status">Trạng thái</MenuItem>
          </TextField>
          <TextField
            placeholder="Search invoices..."
            size="small"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 280 }}
          />
        </Box>
      </Box>
      
      {/* Main content area with fixed height and scrolling */}
      <Box sx={{ 
        flexGrow: 1,
        display: 'flex', 
        flexDirection: 'column',
        height: 0, 
        minHeight: 300, 
        overflow: 'auto' 
      }}>
        {/* Sticky column header row */}
        <Box
          display="flex"
          px={2}
          py={1}
          bgcolor="#f5f5f5"
          borderRadius={1}
          fontWeight={600}
          alignItems="center"
          mb={1}
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 2,
            backgroundColor: '#f5f5f5',
          }}
        >
          <Box minWidth={50}></Box>
          <Box flex={2} minWidth={120} display="flex" justifyContent="center">
            <Typography variant="subtitle2" align="center">Số Hoá Đơn</Typography>
          </Box>
          <Box flex={2} minWidth={120} display="flex" justifyContent="center">
            <Typography variant="subtitle2" align="center">Cửa Hàng</Typography>
          </Box>
          <Box flex={2} minWidth={120} display="flex" justifyContent="center">
            <Typography variant="subtitle2" align="center">Ngày Tạo</Typography>
          </Box>
          <Box flex={2} minWidth={120} display="flex" justifyContent="center">
            <Typography variant="subtitle2" align="center">Tổng Tiền</Typography>
          </Box>
          <Box flex={1} minWidth={100} display="flex" justifyContent="center">
            <Typography variant="subtitle2" align="center">Trạng Thái</Typography>
          </Box>
        </Box>
        
        {/* Invoice List - With fixed height and scrolling */}
        <Box sx={{ 
          flexGrow: 1, 
          overflowY: 'auto',
          px: 1 
        }}>
          {paginatedInvoices.length > 0 ? (
            paginatedInvoices.map((invoice: InvoiceList) => (
              <InvoiceCard
                key={invoice.id}
                invoice={invoice}
                expanded={expandedInvoiceIds.includes(invoice.id)}
                onExpand={toggleInvoiceExpand}
                onApprove={() => approveInvoice(invoice.id)}
                onReject={() => rejectInvoice(invoice.id)}
                onDelete={() => deleteInvoice(invoice.id)}
                loading={getLoadingState(invoice.id)}
                invoiceDetail={expandedInvoiceIds.includes(invoice.id) ? invoiceDetails[invoice.id] : null}
                fetchInvoiceDetail={fetchInvoiceDetail}
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" align="center" mt={4}>
              Không tìm thấy hoá đơn nào.
            </Typography>
          )}
        </Box>
      </Box>
      
      {/* Pagination Controls */}
      <Box
        display="flex"
        px={2}
        py={1}
        borderRadius={1}
        fontWeight={600}
        justifyContent="left" 
        sx={{
          position: 'sticky',
          bottom: 0, 
          zIndex: 2,
          boxShadow: '0 -2px 5px rgba(0,0,0,0.1)', 
        }}
      >
        <PaginationControls
          page={page}
          rowsPerPage={rowsPerPage}
          pageCount={pageCount}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Box>
    </Box>
  );

};

export default InvoiceList;
