import React, { useState } from 'react';
import { Card, InputAdornment, TextField, Box, Typography, Skeleton, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InvoiceCard from './InvoiceCard';
import { Badge } from 'react-bootstrap';
import { mockInvoices, mockInvoiceDetail } from '../../../mock/mockData';

interface Invoice {
  id: string;
  invoice_number: string;
  store_name: string;
  created_date_formatted: string;
  total_amount: number;
  status: string;
}

const InvoiceList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedInvoiceIds, setExpandedInvoiceIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc' | 'status'>('date_desc');

  const invoices = mockInvoices[0]?.results || [];

  const filteredInvoices = invoices.filter((invoice: Invoice) =>
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
        return a.total_amount - b.total_amount;
      case 'amount_desc':
        return b.total_amount - a.total_amount;
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const toggleInvoiceExpand = (id: string) => {
    setExpandedInvoiceIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <Card sx={{ boxShadow: 2, mb: 2 }}>
      <Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center">
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
      <Box px={2} pb={2}>
        {sortedInvoices.length > 0 ? (
          sortedInvoices.map((invoice: Invoice) => (
            <InvoiceCard
              key={invoice.id}
              invoice={invoice}
              expanded={expandedInvoiceIds.includes(invoice.id)}
              onExpand={toggleInvoiceExpand}
              onApprove={id => {}}
              onReject={id => {}}
              onDelete={id => {}}
            />
          ))
        ) : (
          <Box py={4} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Không có sản phẩm nào
            </Typography>
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default InvoiceList;
