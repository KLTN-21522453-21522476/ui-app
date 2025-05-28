// MembersSection.tsx
import React, { useState, useEffect } from 'react'; // Thêm useEffect
import { Spinner, Alert } from 'react-bootstrap';
import AddMemberModal from '../../modal/AddMemberModal';
import { FaSearch, FaPlus } from 'react-icons/fa';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MemberCard from './MemberCard';
import { useMembers } from '../../../hooks/useMembers';
import PaginationControls from './PaginationControls';
import { Box, Typography } from '@mui/material';

interface MembersSectionProps {
  groupId: string;
  isAdmin: boolean;
}

const MembersSection: React.FC<MembersSectionProps> = ({ groupId, isAdmin }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('viewer');
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Use useMembers hook
  const { 
    members, 
    isLoading, 
    error, 
    addNewMember, 
    fetchMembers 
  } = useMembers(groupId);

  // Fetch members when component mounts or groupId changes
  useEffect(() => {
    if (groupId) {
      fetchMembers();
    }
  }, [groupId, fetchMembers]);

  // Filter members based on search term
  const filteredMembers = members.filter(member => 
    member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.user_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Rest of your component remains the same
  // ...


  // Calculate pagination
  const pageCount = Math.ceil(filteredMembers.length / rowsPerPage);
  const paginatedMembers = filteredMembers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Handle pagination changes
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setPage(1);
  };

  // Handle adding a new member
  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) return;
    
    try {
      await addNewMember(newMemberEmail, [newMemberRole]);
      setNewMemberEmail('');
      setShowAddMemberModal(false);
    } catch (error) {
      console.error('Error adding member:', error);
      // Handle error (show notification, etc.)
    }
  };

  // Handle role change
  // const handleRoleChange = async (userId: string, newRole: string) => {
  //   try {
  //     await updateMember(userId, [newRole]);
  //   } catch (error) {
  //     console.error('Error updating member role:', error);
  //   }
  // };

  // Handle member deletion
  // const handleDeleteMember = async (userId: string) => {
  //   if (window.confirm('Are you sure you want to remove this member?')) {
  //     try {
  //       await removeMemberById(userId);
  //     } catch (error) {
  //       console.error('Error removing member:', error);
  //     }
  //   }
  // };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%', 
      width: '100%',
    }}>

      {/* Header with search and actions */}
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
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Typography variant="h6">Team Members</Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Box sx={{ position: 'relative' }}>
            <FaSearch style={{ position: 'absolute', top: '50%', left: 12, transform: 'translateY(-50%)', color: '#888' }} />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: 200,
                paddingLeft: 36,
                height: 36,
                borderRadius: 4,
                border: '1px solid #ccc',
                outline: 'none',
              }}
            />
          </Box>
          {isAdmin && (
            <>
              <IconButton
                aria-label="more"
                aria-controls="add-member-menu"
                aria-haspopup="true"
                onClick={(event) => setMenuAnchorEl(event.currentTarget)}
                size="small"
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="add-member-menu"
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={() => setMenuAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem
                  onClick={() => {
                    setShowAddMemberModal(true);
                    setMenuAnchorEl(null);
                  }}
                >
                  <FaPlus style={{ marginRight: 8 }} size={12} /> Thêm thành viên
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Box>

      {/* Content area with scrolling - key fix here */}
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto',
        px: 1,
        maxHeight: '500px',       
      }}>
          
        {isLoading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : paginatedMembers.length > 0 ? (
          paginatedMembers.map(member => (
            <div key={member.user_id} className="w-100">
              <MemberCard 
                member={member} 
                isAdmin={isAdmin}
                groupId={groupId}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-5">
            <p className="text-muted mb-0">No members found</p>
          </div>
        )}
        </Box>

        {/* Pagination Controls */}
        <Box
          sx={{
            display: 'flex',
            padding: 2,
            borderRadius: 1,
            position: 'sticky',
            bottom: 0, 
            zIndex: 2,
            boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',
            backgroundColor: 'background.paper',
            width: '100%',
          }}
        >
          <PaginationControls
            page={page}
            rowsPerPage={rowsPerPage}
            pageCount={pageCount}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 20, 50]}
          />
        </Box>


      {/* Add Member Modal */}
      <AddMemberModal
        show={showAddMemberModal}
        onHide={() => setShowAddMemberModal(false)}
        email={newMemberEmail}
        role={newMemberRole}
        onEmailChange={setNewMemberEmail}
        onRoleChange={setNewMemberRole}
        onAdd={handleAddMember}
        isProcessing={isLoading}
        error={error as string | null}
      />
    </Box>
  
  );
};

export default MembersSection;
