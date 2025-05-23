// src/components/layouts/group/GroupCard.tsx
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { mockGroupList } from '../../../mock/mockData';
import { GroupDetails } from '../../../types/GroupDetails';
import { useDispatch } from 'react-redux';
import { setSelectedGroupId } from '../../../redux/slices/groupSlice';
import { useNavigate } from 'react-router-dom';

interface GroupCardProps {
  groupId: string;
  isAdmin: boolean;
  onRename: (group: GroupDetails) => void;
  onDelete: (group: GroupDetails) => void;
  selectedGroupId?: string | null;
}

export const GroupCard: React.FC<GroupCardProps> = ({
  groupId,
  isAdmin,
  onRename,
  onDelete,
  selectedGroupId
}) => {
  // Find group data from mockGroupList
  const group = mockGroupList.find((g: { id: string }) => g.id === groupId);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!group) return null;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCardClick = () => {
    dispatch(setSelectedGroupId(group.id));
    navigate('/dashboard');
  };

  const isSelected = selectedGroupId === group.id;

  return (
    <Card
      sx={{
        height: '100%',
        boxShadow: isSelected ? 6 : 3,
        borderRadius: 2,
        border: isSelected ? '2px solid #1976d2' : '2px solid transparent',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s, border 0.2s',
        backgroundColor: isSelected ? 'rgba(25, 118, 210, 0.07)' : 'background.paper',
      }}
      onClick={handleCardClick}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Stack spacing={0.5}>
            <Typography variant="h6" fontWeight={700} gutterBottom>{group.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              Ngày tạo: {group.created_date ? new Date(group.created_date).toLocaleDateString() : 'Không rõ'}
            </Typography>
          </Stack>
          <IconButton
            aria-label="more"
            onClick={e => {
              e.stopPropagation();
              handleMenuOpen(e);
            }}
            size="small"
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem
              onClick={e => {
                e.stopPropagation();
                handleMenuClose();
                onRename(group);
              }}
            >
              Đổi tên
            </MenuItem>
            <MenuItem
              onClick={e => {
                e.stopPropagation();
                handleMenuClose();
                onDelete(group);
              }}
              sx={{ color: 'error.main' }}
            >
              Xoá
            </MenuItem>
          </Menu>
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body1" gutterBottom>{group.description}</Typography>
        <Stack direction="row" spacing={2} mb={1} alignItems="center">
          <Chip label={`Số lượng hoá đơn: ${group.invoice_count}`} color="primary" variant="outlined" />
          <Chip label={`Vai trò: ${group.user_roles?.join(', ') || 'Không rõ'}`} color="secondary" variant="outlined" />
        </Stack>
      </CardContent>
    </Card>
  );
};