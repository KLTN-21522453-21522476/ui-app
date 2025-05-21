// src/pages/GroupDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form, Dropdown } from 'react-bootstrap';
import { FaEllipsisH, FaPlus, FaCrown, FaUser, FaUserCog, FaTrash } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { GroupDetails, Members } from '../types/GroupDetails';
import { deleteGroupMember, updateGroupMemberRoles } from '../api/groupApi';
import '../styles/GroupDashboard.css';


const GroupDashboard: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { user } = useAuth();
  const [group, setGroup] = useState<GroupDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setShowAddMemberModal] = useState(false);
  //const [newMember, setNewMember] = useState({ name: '', position: '', role: 'viewer' });
  const [memberToDelete, setMemberToDelete] = useState<Members | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [memberToUpdateRole, setMemberToUpdateRole] = useState<Members | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('viewer');

  // Mock invoices data (would be fetched from API in real implementation)
  const [invoices, setInvoices] = useState<Invoice[]>(null);

  // Check if current user is admin
  const isAdmin = (): boolean => {
    if (!user || !group) return false;
    const currentUserMember = group.members.find(member => member.user_id === user.$id);
    return currentUserMember?.roles?.includes('admin') || false;
  };

  // Fetch group data
  useEffect(() => {
    const fetchGroupData = async () => {
      if (!groupId) return;
      
      try {
        setIsLoading(true);
        // This would be an actual API call in production
        // const response = await fetchGroupById(groupId);
        // setGroup(response);
        
        // For demo purposes, we'll create mock data
        setTimeout(() => {
          const mockGroup: Group = {
            id: groupId,
            name: "Marketing Team",
            created_date: new Date().toISOString(),
            invoice_count: invoices.length,
            members: [
              { user_id: "user1", roles: ["admin"] },
              { user_id: "user2", roles: ["viewer"] },
              { user_id: "user3", roles: ["editor"] },
              { user_id: "user4", roles: ["viewer"] },
              { user_id: "user5", roles: ["viewer"] },
            ],
            created_by: "user1"
          };
          
          setGroup(mockGroup);
          setIsLoading(false);
        }, 500);
      } catch (err) {
        setError("Failed to load group data");
        setIsLoading(false);
      }
    };
    
    fetchGroupData();
  }, [groupId]);

  // Handle member deletion
  const handleDeleteMember = async () => {
    if (!memberToDelete || !group) return;
    
    try {
      await deleteGroupMember(group.id, [memberToDelete]);
      
      // Update local state
      setGroup({
        ...group,
        members: group.members.filter(m => m.user_id !== memberToDelete.user_id)
      });
      
      setShowDeleteModal(false);
      setMemberToDelete(null);
    } catch (err) {
      console.error("Failed to delete member:", err);
      // Handle error (show notification, etc.)
    }
  };

  // Handle role update
  const handleUpdateRole = async () => {
    if (!memberToUpdateRole || !group || !selectedRole) return;
    
    try {
      const updatedMember = {
        ...memberToUpdateRole,
        roles: [selectedRole]
      };
      
      await updateGroupMemberRoles(group.id, [updatedMember]);
      
      // Update local state
      setGroup({
        ...group,
        members: group.members.map(m => 
          m.user_id === memberToUpdateRole.user_id ? updatedMember : m
        )
      });
      
      setShowRoleModal(false);
      setMemberToUpdateRole(null);
    } catch (err) {
      console.error("Failed to update member role:", err);
      // Handle error (show notification, etc.)
    }
  };

  // Function to get user display name (mock function)
  const getUserDisplayName = (userId: string): string => {
    const mockUsers: {[key: string]: string} = {
      "user1": "Jimmy Denis",
      "user2": "Chandra Felix",
      "user3": "Talha Ahmed",
      "user4": "Chad Johnson",
      "user5": "Farrah Smith"
    };
    
    return mockUsers[userId] || `User ${userId.slice(0, 4)}`;
  };

  // Function to get user position (mock function)
  const getUserPosition = (userId: string): string => {
    const mockPositions: {[key: string]: string} = {
      "user1": "Graphic Designer",
      "user2": "Sales Promotion",
      "user3": "Front End Designer",
      "user4": "CEO",
      "user5": "Marketing"
    };
    
    return mockPositions[userId] || "Team Member";
  };

  // Function to get initials from name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Function to get random color for avatar
  const getAvatarColor = (id: string) => {
    const colors = ['#3498db', '#9b59b6', '#e74c3c', '#2ecc71', '#f39c12', '#1abc9c'];
    const colorIndex = parseInt(id.replace(/[^0-9]/g, '')) % colors.length;
    return colors[colorIndex];
  };

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (error || !group) {
    return (
      <Container className="py-4">
        <div className="alert alert-danger">
          {error || "Group not found"}
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="group-dashboard py-4">
      <Row className="mb-4">
        <Col>
          <h2>{group.name}</h2>
          <p className="text-muted">
            Created on {new Date(group.created_date || Date.now()).toLocaleDateString()} • 
            {group.invoice_count} Invoices • {group.members.length} Members
          </p>
        </Col>
      </Row>
      
      <Row>
        <Col md={5} lg={4} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
              <h5 className="mb-0">Members</h5>
              {isAdmin() && (
                <div>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="rounded-pill" 
                    onClick={() => setShowAddMemberModal(true)}
                  >
                    <FaPlus className="me-1" /> Add Member
                  </Button>
                </div>
              )}
            </Card.Header>
            <Card.Body className="p-0">
              <div className="member-list">
                {group.members.map(member => {
                  const displayName = getUserDisplayName(member.user_id);
                  const position = getUserPosition(member.user_id);
                  const isUserAdmin = member.roles.includes('admin');
                  
                  return (
                    <div key={member.user_id} className="member-item d-flex align-items-center p-3 border-bottom">
                      <div 
                        className="rounded-circle member-avatar d-flex align-items-center justify-content-center" 
                        style={{ backgroundColor: getAvatarColor(member.user_id) }}
                      >
                        {getInitials(displayName)}
                      </div>
                      
                      <div className="ms-3 flex-grow-1">
                        <div className="d-flex align-items-center">
                          <h6 className="mb-0">{displayName}</h6>
                          {isUserAdmin && (
                            <Badge bg="warning" text="dark" className="ms-2 d-flex align-items-center">
                              <FaCrown size={10} className="me-1" /> Admin
                            </Badge>
                          )}
                          {member.roles.includes('editor') && !isUserAdmin && (
                            <Badge bg="info" text="dark" className="ms-2">
                              Editor
                            </Badge>
                          )}
                          {member.roles.includes('viewer') && member.roles.length === 1 && (
                            <Badge bg="secondary" text="light" className="ms-2">
                              Viewer
                            </Badge>
                          )}
                        </div>
                        <small className="text-muted">{position}</small>
                      </div>
                      
                      {isAdmin() && user && member.user_id !== user.$id && (
                        <div className="member-actions">
                          <Dropdown>
                            <Dropdown.Toggle variant="light" size="sm" id={`dropdown-${member.user_id}`}>
                              <FaEllipsisH />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item 
                                onClick={() => {
                                  setMemberToUpdateRole(member);
                                  setSelectedRole(member.roles[0] || 'viewer');
                                  setShowRoleModal(true);
                                }}
                              >
                                <FaUserCog className="me-2" /> Change Role
                              </Dropdown.Item>
                              <Dropdown.Item 
                                className="text-danger"
                                onClick={() => {
                                  setMemberToDelete(member);
                                  setShowDeleteModal(true);
                                }}
                              >
                                <FaTrash className="me-2" /> Remove Member
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={7} lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
              <h5 className="mb-0">Invoice History</h5>
              <Button variant="light" size="sm">
                <FaEllipsisH />
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive className="invoice-table mb-0">
                <thead>
                  <tr>
                    <th>INVOICE NUMBER</th>
                    <th>DATE & TIME</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(invoice => (
                    <tr key={invoice.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className={`status-icon ${invoice.status.toLowerCase()}`}>
                            {invoice.status === 'Completed' && <FaUser />}
                            {invoice.status === 'Pending' && <FaUser />}
                            {invoice.status === 'Failed' && <FaUser />}
                          </div>
                          <span>Invoice {invoice.number}</span>
                        </div>
                      </td>
                      <td>{invoice.date}</td>
                      <td>${invoice.amount.toFixed(2)}</td>
                      <td>
                        <Badge 
                          bg={
                            invoice.status === 'Completed' ? 'success' : 
                            invoice.status === 'Pending' ? 'warning' : 
                            'danger'
                          }
                          className="status-badge"
                        >
                          {invoice.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Delete Member Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Removal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove <strong>{memberToDelete ? getUserDisplayName(memberToDelete.user_id) : ''}</strong> from this group?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteMember}>
            Remove Member
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Change Role Modal */}
      <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Change Member Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Change role for <strong>{memberToUpdateRole ? getUserDisplayName(memberToUpdateRole.user_id) : ''}</strong>:</p>
          <Form.Group>
            <Form.Select 
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </Form.Select>
          </Form.Group>
          <div className="mt-3">
            <small className="text-muted">
              <strong>Admin:</strong> Full control over group settings and members<br />
              <strong>Editor:</strong> Can create and edit invoices<br />
              <strong>Viewer:</strong> Can only view invoices
            </small>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRoleModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateRole}>
            Update Role
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GroupDashboard;
