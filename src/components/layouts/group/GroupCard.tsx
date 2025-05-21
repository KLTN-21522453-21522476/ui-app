// src/components/group/GroupCard.tsx
import React, { useEffect } from 'react';
import { Card, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaEllipsisV, FaUser, FaTrash, FaEdit } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { fetchGroupDetailsData } from '../../../redux/slices/groupSlice';
import { GroupDetails } from '../../../types/GroupDetails';

interface GroupCardProps {
  groupId: string;
  isAdmin: boolean;
  onRename: (group: GroupDetails) => void;
  onDelete: (group: GroupDetails) => void;
}

export const GroupCard: React.FC<GroupCardProps> = ({ 
  groupId, 
  isAdmin, 
  onRename, 
  onDelete 
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const groupDetails = useAppSelector((state) => state.groups.groupDetails[groupId]);
  const isLoading = useAppSelector((state) => state.groups.isLoading);
  const error = useAppSelector((state) => state.groups.error);

  // Fetch group details khi component được mount
  useEffect(() => {
    if (!groupDetails) {
      dispatch(fetchGroupDetailsData(groupId));
    }
  }, [dispatch, groupId, groupDetails]);

  const handleCardClick = () => {
    navigate(`/groups/${groupId}`);
  };

  if (isLoading && !groupDetails) {
    return (
      <Card className="h-100 group-card">
        <Card.Body>
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  }

  if (error && !groupDetails) {
    return (
      <Card className="h-100 group-card bg-light">
        <Card.Body>
          <div className="text-center py-4 text-danger">
            <p>Không thể tải thông tin nhóm</p>
          </div>
        </Card.Body>
      </Card>
    );
  }

  if (!groupDetails) {
    return null;
  }

  return (
    <Card 
      className="h-100 group-card" 
      style={{ 
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '';
      }}
      onClick={handleCardClick}
    >
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <Card.Title className="mb-0 d-flex align-items-center">
              <span className="me-1">@</span> {groupDetails.name}
            </Card.Title>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <Dropdown>
              <Dropdown.Toggle 
                as="button"
                className="p-0 text-dark border-0 bg-transparent"
                id={`dropdown-${groupId}`}
              >
                <FaEllipsisV />
              </Dropdown.Toggle>

              <Dropdown.Menu align="end">
                {isAdmin && (
                  <Dropdown.Item 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onRename(groupDetails);
                    }}
                    className="d-flex align-items-center py-2"
                  >
                    <FaEdit className="me-3 text-primary" />
                    <span>Đổi tên</span>
                  </Dropdown.Item>
                )}
                <Dropdown.Item 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(groupDetails);
                  }}
                  className="d-flex align-items-center py-2 text-danger" 
                >
                  <FaTrash className="me-3" />
                  <span>Xoá</span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <div className="mt-2 small text-muted">
          {groupDetails.created_date ? 
            `Created on ${new Date(groupDetails.created_date).toLocaleDateString()}` : 
            'Recently created'}
        </div>
        <div className="d-flex mt-2">
          <div className="small text-muted me-3">
            {groupDetails.invoice_count} Hoá đơn • {groupDetails.members.length} Thành viên
          </div>
        </div>
        <div className="mt-3">
          <div className="d-flex">
            {groupDetails.members.slice(0, 3).map((member, index) => (
              <div 
                key={member.user_id} 
                className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                style={{ 
                  width: '30px', 
                  height: '30px', 
                  marginLeft: index > 0 ? '-10px' : '0',
                  position: 'relative',
                  zIndex: 3 - index
                }}
              >
                <FaUser size={12} />
              </div>
            ))}
            {groupDetails.members.length > 3 && (
              <div 
                className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                style={{ 
                  width: '30px', 
                  height: '30px', 
                  marginLeft: '-10px',
                  border: '1px solid #dee2e6'
                }}
              >
                <small>+{groupDetails.members.length - 3}</small>
              </div>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
