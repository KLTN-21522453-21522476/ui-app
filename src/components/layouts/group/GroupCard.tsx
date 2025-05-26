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
import { GroupList } from '../../../types/GroupList';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSelectedGroupId } from '../../../redux/slices/groupSlice';
import { RootState } from '../../../redux/store';

interface GroupCardProps {
  group: GroupList;
  onRename: (group: GroupList) => void;
  onDelete: (group: GroupList) => void;
  onAddMember?: (group: GroupList) => void;
  selectedGroupId?: string | null;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group, onRename, onDelete, onAddMember, selectedGroupId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = () => {
    dispatch(setSelectedGroupId(group.id));
    if (user) {
      navigate('/dashboard');
    }
  };

  const handleRename = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
    onRename(group);
    handleClose();
  };

  const handleDelete = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
    onDelete(group);
    handleClose();
  };

  const isAdmin = group.user_roles.includes('admin');

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        border: selectedGroupId === group.id ? '2px solid #007bff' : '1px solid #e0e0e0',
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          border: '1px solid #007bff',
          boxShadow: 2,
        },
        '&:hover .MuiCardActions-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.03)',
        },
        backgroundColor: 'background.paper',
      }}
      onClick={handleSelect} // Loại bỏ điều kiện kiểm tra và gọi trực tiếp handleSelect
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                {group.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mô tả: {group.description}
              </Typography>
            </Stack>
            <IconButton
              aria-label="more"
              aria-controls="group-menu"
              aria-haspopup="true"
              onClick={handleClick}
              size="small"
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <MoreVertIcon sx={{ color: 'text.secondary' }} />
            </IconButton>
          </Stack>
          <Divider sx={{ my: 1 }} />
          <Stack spacing={1.5}>
            <Typography variant="body2" color="text.secondary">
              <span style={{ fontWeight: 600 }}>ID:</span> {group.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <span style={{ fontWeight: 600 }}>Ngày tạo:</span> {group.created_date}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <span style={{ fontWeight: 600 }}>Người tạo:</span> {group.created_by}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <span style={{ fontWeight: 600 }}>Số lượng hóa đơn:</span> {group.invoice_count}
            </Typography>
            {group.description && (
              <Typography variant="body2" color="text.secondary">
                <span style={{ fontWeight: 600 }}>Mô tả:</span> {group.description}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary">
              <span style={{ fontWeight: 600 }}>Ngày cập nhật:</span> {group.updated_date}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <span style={{ fontWeight: 600 }}>Người cập nhật:</span> {group.updated_by}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <span style={{ fontWeight: 600 }}>Vai trò:</span> {group.user_roles.join(', ')}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Menu
        id="group-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()} // Ngăn chặn sự kiện click lan ra ngoài Menu
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            '& .MuiMenuItem-root': {
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
              },
            },
          },
        }}
      >
        {isAdmin ? (
          <>
            <MenuItem
              onClick={handleRename}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05) !important',
                },
              }}
            >
              <Typography variant="body2">Đổi tên</Typography>
            </MenuItem>
            <MenuItem
              onClick={handleDelete}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05) !important',
                },
              }}
            >
              <Typography variant="body2">Xóa Nhóm</Typography>
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                if (onAddMember) onAddMember(group);
                handleClose();
              }}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05) !important',
                },
              }}
            >
              <Typography variant="body2">Thêm thành viên</Typography>
            </MenuItem>
            <MenuItem
              onClick={(e) => e.stopPropagation()} // Ngăn chặn sự kiện click lan ra ngoài
              sx={{
                color: 'error.main',
                '&:hover': {
                  backgroundColor: 'rgba(220, 53, 69, 0.08) !important',
                },
              }}
            >
              <Typography variant="body2">Rời Nhóm</Typography>
            </MenuItem>
          </>
        ) : (
          <MenuItem
            onClick={(e) => e.stopPropagation()} // Ngăn chặn sự kiện click lan ra ngoài
            sx={{
              color: 'error.main',
              '&:hover': {
                backgroundColor: 'rgba(220, 53, 69, 0.08) !important',
              },
            }}
          >
            <Typography variant="body2">Rời Nhóm</Typography>
          </MenuItem>
        )}
      </Menu>
    </Card>
  );
};
