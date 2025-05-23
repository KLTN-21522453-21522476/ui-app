import React from 'react';
import { mockInvoiceDetail } from '../../../mock/mockData';
import {
  Card,
  Collapse,
  Box,
  Typography,
  IconButton,
  Button,
  Stack,
  Chip,
  Divider,
  Skeleton,
  Dialog
} from '@mui/material';
import { formatDateForDisplay } from '../../../utils/dateUtils';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { styled } from '@mui/material/styles';

export interface InvoiceCardProps {
  invoice: {
    id: string;
    invoice_number: string;
    store_name: string;
    created_date_formatted: string;
    total_amount: number;
    status: string;
    [key: string]: any;
  };
  expanded: boolean;
  onExpand: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

const ExpandIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'color 0.2s',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const statusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'success';
    case 'pending':
      return 'warning';
    case 'rejected':
      return 'error';
    default:
      return 'default';
  }
};

const getActionButtons = (
  status: string,
  id: string,
  onApprove: (id: string) => void,
  onReject: (id: string) => void,
  onDelete: (id: string) => void
) => {
  switch (status) {
    case 'pending':
      return (
        <Stack direction="row" spacing={1}>
          <Button size="small" color="success" startIcon={<CheckCircleIcon />} onClick={() => onApprove(id)}>
            Duyệt
          </Button>
          <Button size="small" color="error" startIcon={<CancelIcon />} onClick={() => onReject(id)}>
            Từ chối
          </Button>
          <Button size="small" color="inherit" startIcon={<DeleteIcon />} onClick={() => onDelete(id)}>
            Xóa
          </Button>
        </Stack>
      );
    case 'approved':
      return (
        <Stack direction="row" spacing={1}>
          <Button size="small" color="error" startIcon={<CancelIcon />} onClick={() => onReject(id)}>
            Từ chối
          </Button>
          <Button size="small" color="inherit" startIcon={<DeleteIcon />} onClick={() => onDelete(id)}>
            Xóa
          </Button>
        </Stack>
      );
    case 'rejected':
      return (
        <Stack direction="row" spacing={1}>
          <Button size="small" color="success" startIcon={<CheckCircleIcon />} onClick={() => onApprove(id)}>
            Duyệt
          </Button>
          <Button size="small" color="inherit" startIcon={<DeleteIcon />} onClick={() => onDelete(id)}>
            Xóa
          </Button>
        </Stack>
      );
    default:
      return (
        <Stack direction="row" spacing={1}>
          <Button size="small" color="success" startIcon={<CheckCircleIcon />} onClick={() => onApprove(id)}>
            Duyệt
          </Button>
          <Button size="small" color="error" startIcon={<CancelIcon />} onClick={() => onReject(id)}>
            Từ chối
          </Button>
          <Button size="small" color="inherit" startIcon={<DeleteIcon />} onClick={() => onDelete(id)}>
            Xóa
          </Button>
        </Stack>
      );
  }
};

const InvoiceCard: React.FC<InvoiceCardProps> = ({
  invoice,
  expanded,
  onExpand,
  onApprove,
  onReject,
  onDelete,
  loading = false
}) => {
  // Find the detail that matches this invoice
  const invoiceDetail = mockInvoiceDetail.find(detail => detail.id === invoice.id) || invoice;

  const [openImageModal, setOpenImageModal] = React.useState(false);
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenImageModal(true);
  };

  if (loading) {
    return (
      <Card sx={{ mb: 2, p: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="rectangular" width="40%" height={24} />
          <Skeleton variant="rectangular" width="20%" height={24} />
          <Skeleton variant="rectangular" width="20%" height={24} />
          <Skeleton variant="rectangular" width="10%" height={24} />
        </Stack>
        <Skeleton variant="rectangular" width="100%" height={40} sx={{ mt: 2 }} />
      </Card>
    );
  }

  return (
    <Card
      sx={{
        mb: 2,
        boxShadow: expanded ? 6 : 1,
        transition: 'box-shadow 0.3s',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 8,
        },
      }}
      onClick={() => onExpand(invoice.id)}
    >
      <Box display="flex" alignItems="center" px={2} py={1}>
        <ExpandIndicator mr={2}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ExpandIndicator>
        <Box flex={1} display="flex" alignItems="center" gap={2}>
          <Typography variant="subtitle1" width={120} fontWeight={600}>
            {invoice.invoice_number}
          </Typography>
          <Typography width={160}>{invoice.store_name}</Typography>
          <Typography width={120}>{formatDateForDisplay(invoice.created_date_formatted)}</Typography>
          <Typography width={120} fontWeight={600} color="primary">
            {invoice.total_amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          </Typography>
          <Chip label={invoice.status} color={statusColor(invoice.status)} size="small" />
        </Box>

      </Box>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider sx={{ my: 1 }} />
        <Box px={2} pb={2}>
          <Box display="flex" gap={3} flexDirection={{ xs: 'column', md: 'row' }} alignItems="flex-start">
  <Box flexShrink={0}>
    <img
      src={invoiceDetail.image_url}
      alt="Invoice"
      style={{ maxWidth: 180, maxHeight: 180, borderRadius: 8, border: '1px solid #eee', cursor: 'pointer' }}
      onClick={handleImageClick}
    />
    {/* Image Modal */}
    <Dialog 
      open={openImageModal} 
      onClose={e => {
        // Only stopPropagation if MouseEvent
        if (e && typeof (e as any).stopPropagation === 'function') {
          (e as React.MouseEvent).stopPropagation();
        }
        setOpenImageModal(false);
      }} 
      maxWidth="md" 
      fullWidth
      onClick={e => {
        if (e && typeof (e as any).stopPropagation === 'function') {
          (e as React.MouseEvent).stopPropagation();
        }
      }}
    >
      <Box position="relative" bgcolor="#000" display="flex" justifyContent="center" alignItems="center" onClick={e => {
        if (e && typeof (e as any).stopPropagation === 'function') {
          (e as React.MouseEvent).stopPropagation();
        }
      }}>
        <IconButton
          onClick={e => {
            if (e && typeof (e as any).stopPropagation === 'function') {
              (e as React.MouseEvent).stopPropagation();
            }
            setOpenImageModal(false);
          }}
          sx={{ position: 'absolute', top: 8, right: 8, color: '#fff', zIndex: 2 }}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
        <img
          src={invoiceDetail.image_url}
          alt="Invoice Large"
          style={{ width: '100%', maxWidth: 700, maxHeight: '80vh', objectFit: 'contain', display: 'block', margin: '0 auto', background: '#000' }}
        />
      </Box>
    </Dialog>
  </Box>
  <Box flex={1}>
    <Box onClick={e => e.stopPropagation()}>
      {getActionButtons(invoice.status, invoice.id, onApprove, onReject, onDelete)}
    </Box>
    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
      Số Hoá Đơn: {invoiceDetail.invoice_number}
    </Typography>
    <Typography variant="body2" gutterBottom>
      <strong>Địa chỉ:</strong> {invoiceDetail.address}
    </Typography>
    <Typography variant="body2" gutterBottom>
      <strong>Cửa Hàng:</strong> {invoiceDetail.store_name}
    </Typography>
    <Typography variant="body2" gutterBottom>
      <strong>Ngày tạo:</strong> {formatDateForDisplay(invoiceDetail.created_date_formatted)}
    </Typography>
    <Typography variant="body2" gutterBottom>
      <strong>Trạng thái:</strong> {invoiceDetail.status}
    </Typography>
    <Typography variant="body2" gutterBottom>
      <strong>Tổng cộng:</strong> {invoiceDetail.total_amount?.toLocaleString()} đồng
    </Typography>
    <Box mt={2}>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>Danh sách sản phẩm</Typography>
      <Box component="table" width="100%" sx={{ borderCollapse: 'collapse', fontSize: 14 }}>
        <Box component="thead" sx={{ background: '#f5f5f5' }}>
          <Box component="tr">
            <Box component="th" sx={{ p: 1, border: '1px solid #eee' }}>Tên sản phẩm</Box>
            <Box component="th" sx={{ p: 1, border: '1px solid #eee' }}>Số lượng</Box>
            <Box component="th" sx={{ p: 1, border: '1px solid #eee' }}>Giá</Box>
          </Box>
        </Box>
        <Box component="tbody">
          {invoiceDetail.items.map((item: any) => (
            <Box component="tr" key={item.id}>
              <Box component="td" sx={{ p: 1, border: '1px solid #eee' }}>{item.item}</Box>
              <Box component="td" sx={{ p: 1, border: '1px solid #eee' }}>{item.quantity}</Box>
              <Box component="td" sx={{ p: 1, border: '1px solid #eee' }}>{item.price.toLocaleString()} đồng</Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  </Box>
</Box>
        </Box>
      </Collapse>
    </Card>
  );
};

export default InvoiceCard;
