import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { FaEllipsisH, FaUserShield, FaUserEdit, FaUser, FaTrash, FaCrown, FaCog } from 'react-icons/fa';
import { Members } from '../../../types/GroupDetails';

interface MemberCardProps {
  member: Members;
  isAdmin: boolean;
  onRoleChange?: (userId: string, newRole: string) => void;
  onDelete?: (userId: string) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ 
  member, 
  isAdmin, 
  onRoleChange, 
  onDelete 
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  
  // Function to get user display name
  const getDisplayName = (): string => {
    return member.name || member.email?.split('@')[0] || `User ${member.user_id.slice(0, 4)}`;
  };

  // Function to get initials from name or email
  const getInitials = (): string => {
    const name = getDisplayName();
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Function to get random color for avatar
  const getAvatarColor = (id: string): string => {
    const colors = ['#3498db', '#9b59b6', '#e74c3c', '#2ecc71', '#f39c12', '#1abc9c'];
    const colorIndex = id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % colors.length;
    return colors[colorIndex];
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const displayName = getDisplayName();
  const initials = getInitials();
  const avatarColor = getAvatarColor(member.user_id);
  const addedDate = formatDate(member.added_date);
  
  // Get the highest role (assuming 'admin' is highest, then 'editor', then 'viewer')
  const highestRole = member.roles?.includes('admin') ? 'admin' : 
                      member.roles?.includes('editor') ? 'editor' : 'viewer';
  
  // Role display names and colors
  const roleInfo = {
    admin: { name: 'Admin', color: 'primary', icon: <FaUserShield className="me-1" /> },
    editor: { name: 'Editor', color: 'info', icon: <FaUserEdit className="me-1" /> },
    viewer: { name: 'Viewer', color: 'secondary', icon: <FaUser className="me-1" /> }
  };
  
  const currentRole = roleInfo[highestRole] || roleInfo.viewer;
  const isUserAdmin = highestRole === 'admin';

  return (
    <Card 
      className="shadow-sm border-0 h-100"
      style={{
        marginBottom: '0.5rem', 
        borderRadius: '0.5rem', 
        transition: 'box-shadow 0.3s',
        cursor: 'pointer',
        background: '#fff',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0px 8px 24px rgba(0,0,0,0.12)';
      }}
    >
      <Card.Body className="d-flex flex-column p-3">
        <div className="d-flex justify-content-between align-items-start">
          <div className="d-flex align-items-center">
            <div 
              className="rounded-circle d-flex align-items-center justify-content-center me-3" 
              style={{
                width: '48px', 
                height: '48px', 
                backgroundColor: `${avatarColor}20`,
                color: avatarColor,
                fontSize: '1.25rem',
                fontWeight: 'bold'
              }}
            >
              {initials}
            </div>
            <div>
              <h6 className="mb-0 fw-semibold">{displayName}</h6>
              <small className="text-muted">{member.email || 'No email'}</small>
              
              {/* Added date info */}
              <div className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                Added: {addedDate}
              </div>
            </div>
          </div>
          
          {isAdmin && (
            <>
              <IconButton
                aria-label="more"
                id={`member-menu-button-${member.user_id}`}
                aria-controls={`member-menu-${member.user_id}`}
                aria-haspopup="true"
                onClick={e => setAnchorEl(e.currentTarget)}
                size="small"
                sx={{ color: 'text.secondary' }}
              >
                <FaEllipsisH />
              </IconButton>
              <Menu
                id={`member-menu-${member.user_id}`}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem
                  onClick={() => {
                    onRoleChange?.(member.user_id, isUserAdmin ? 'viewer' : 'admin');
                    setAnchorEl(null);
                  }}
                >
                  {isUserAdmin ? (
                    <><FaUser className="me-2" /> Make Regular User</>
                  ) : (
                    <><FaCog className="me-2" /> Make Admin</>
                  )}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    onDelete?.(member.user_id);
                    setAnchorEl(null);
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <FaTrash className="me-2" /> Remove
                </MenuItem>
              </Menu>
            </>
          )}
        </div>
        
        <div className="mt-3">
          <div className="d-flex flex-wrap gap-2">
            {member.roles?.map(role => (
              <Badge 
                key={role} 
                bg={roleInfo[role as keyof typeof roleInfo]?.color || 'secondary'}
                className="d-flex align-items-center py-2 px-3"
                style={{ fontSize: '0.75rem' }}
              >
                {roleInfo[role as keyof typeof roleInfo]?.icon}
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Badge>
            ))}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MemberCard;
