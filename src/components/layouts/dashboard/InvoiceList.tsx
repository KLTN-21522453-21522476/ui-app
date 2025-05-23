import React, { useState } from 'react';
import { Card, InputAdornment, TextField, Box, Typography, Skeleton } from '@mui/material';
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

  const invoices = mockInvoices[0]?.results || [];

  const filteredInvoices = invoices.filter((invoice: Invoice) =>
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.store_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.created_date_formatted.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleInvoiceExpand = (id: string) => {
    setExpandedInvoiceIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <Card sx={{ boxShadow: 2, mb: 2 }}>
      <Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Hoá đơn gần đây</Typography>
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
      <Box px={2} pb={2}>
        {filteredInvoices.length > 0 ? (
          filteredInvoices.map((invoice: Invoice) => (
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
