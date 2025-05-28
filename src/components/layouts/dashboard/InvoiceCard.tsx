import React from 'react';

import {
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
import InvoiceList from './InvoiceList';

export interface InvoiceCardProps {
  invoice: InvoiceList;
  expanded: boolean;
  onExpand: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
  loading: boolean;
  invoiceDetail: any | null;
  fetchInvoiceDetail: (id: string) => void;
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
  const buttonStyle = {
    fontWeight: 700,
    fontFamily: 'Roboto',
    textTransform: 'none',
  };

  switch (status) {
    case 'pending':
      return (
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            color="success"
            variant="outlined"
            startIcon={<CheckCircleIcon />}
            onClick={() => onApprove(id)}
            sx={{ ...buttonStyle, borderColor: 'success.main', color: 'success.main' }}
          >
            Duyệt
          </Button>
          <Button
            size="small"
            color="error"
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={() => onReject(id)}
            sx={{ ...buttonStyle, borderColor: 'error.main', color: 'error.main' }}
          >
            Từ chối
          </Button>
          <Button
            size="small"
            color="inherit"
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={() => onDelete(id)}
            sx={{ ...buttonStyle, borderColor: 'grey.500', color: 'grey.800' }}
          >
            Xóa
          </Button>
        </Stack>
      );
    case 'approved':
      return (
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            color="error"
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={() => onReject(id)}
            sx={{ ...buttonStyle, borderColor: 'error.main', color: 'error.main' }}
          >
            Từ chối
          </Button>
          <Button
            size="small"
            color="inherit"
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={() => onDelete(id)}
            sx={{ ...buttonStyle, borderColor: 'grey.500', color: 'grey.800' }}
          >
            Xóa
          </Button>
        </Stack>
      );
    case 'rejected':
      return (
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            color="success"
            variant="outlined"
            startIcon={<CheckCircleIcon />}
            onClick={() => onApprove(id)}
            sx={{ ...buttonStyle, borderColor: 'success.main', color: 'success.main' }}
          >
            Duyệt
          </Button>
          <Button
            size="small"
            color="inherit"
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={() => onDelete(id)}
            sx={{ ...buttonStyle, borderColor: 'grey.500', color: 'grey.800' }}
          >
            Xóa
          </Button>
        </Stack>
      );
    default:
      return (
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            color="success"
            variant="outlined"
            startIcon={<CheckCircleIcon />}
            onClick={() => onApprove(id)}
            sx={{ ...buttonStyle, borderColor: 'success.main', color: 'success.main' }}
          >
            Duyệt
          </Button>
          <Button
            size="small"
            color="error"
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={() => onReject(id)}
            sx={{ ...buttonStyle, borderColor: 'error.main', color: 'error.main' }}
          >
            Từ chối
          </Button>
          <Button
            size="small"
            color="inherit"
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={() => onDelete(id)}
            sx={{ ...buttonStyle, borderColor: 'grey.500', color: 'grey.800' }}
          >
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
  loading,
  invoiceDetail,
  fetchInvoiceDetail,
}) => {
  const [openImageModal, setOpenImageModal] = React.useState(false);
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenImageModal(true);
  };

  // Fetch invoice detail when expanded and id changes
  React.useEffect(() => {
    if (expanded) {
      fetchInvoiceDetail(invoice.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded, invoice.id]);

  return (
    <Box
      sx={{
        mb: 1,
        boxShadow: expanded ? 6 : 1,
        borderRadius: 2,
        transition: 'box-shadow 0.3s',
        cursor: 'pointer',
        background: '#fff',
        '&:hover': {
          boxShadow: 8,
        },
        ...(expanded && {
          maxHeight: '80vh',
          overflow: 'auto',
        }),
      }}
      onClick={() => onExpand(invoice.id)}
    >
      {/* Header - luôn hiển thị */}
      <Box display="flex" alignItems="center" px={2} py={1}>
        <ExpandIndicator mr={2}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ExpandIndicator>
        <Box flex={2} minWidth={165} display="flex" justifyContent="center">
          <Typography variant="subtitle1" width={120} fontWeight={600} align="center">
            {invoice.invoice_number}
          </Typography>
        </Box>
        <Box flex={2} minWidth={120} display="flex" justifyContent="center">
          <Typography width={160} align="center">{invoice.store_name}</Typography>
        </Box>
        <Box flex={2} minWidth={120} display="flex" justifyContent="center">
          <Typography width={120} align="center">{formatDateForDisplay(invoice.created_date_formatted)}</Typography>
        </Box>
        <Box flex={2} minWidth={120} display="flex" justifyContent="center">
          <Typography width={120} fontWeight={600} color="primary" align="center">
            {Number(invoice.total_amount).toLocaleString('vi-VN', { minimumFractionDigits: 0 })} VNĐ
          </Typography>
        </Box>
        <Box flex={1} minWidth={100} display="flex" justifyContent="center">
          <Chip label={invoice.status} color={statusColor(invoice.status)} size="small" />
        </Box>
      </Box>
      
      {/* Phần chi tiết - chỉ hiển thị khi expanded */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider sx={{ my: 1 }} />
        <Box px={2} pb={2}>
          {loading || !invoiceDetail ? (
            // Skeleton loading cho phần chi tiết
            <Box display="flex" gap={3} flexDirection={{ xs: 'column', md: 'row' }} alignItems="flex-start">
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Skeleton variant="rectangular" width={180} height={180} sx={{ borderRadius: 1 }} />
                <Box flex={1}>
                  <Skeleton variant="rectangular" width={300} height={36} sx={{ mb: 2 }} />
                  <Stack spacing={1}>
                    <Skeleton variant="text" width="70%" />
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="65%" />
                    <Skeleton variant="text" width="50%" />
                    <Skeleton variant="text" width="40%" />
                  </Stack>
                  <Skeleton variant="rectangular" width="100%" height={120} sx={{ mt: 2 }} />
                </Box>
              </Stack>
            </Box>
          ) : (
            // Nội dung chi tiết khi đã load xong
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
                  <strong>Tổng cộng:</strong> {Number(invoiceDetail.total_amount).toLocaleString('vi-VN', { minimumFractionDigits: 0 })} VNĐ
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
                          <Box component="td" sx={{ p: 1, border: '1px solid #eee' }}>{Number(item.price).toLocaleString('vi-VN', { minimumFractionDigits: 0 })} VNĐ</Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

export default InvoiceCard;
