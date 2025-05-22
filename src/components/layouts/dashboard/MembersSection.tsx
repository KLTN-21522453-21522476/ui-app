import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { FaPlus, FaSearch } from 'react-icons/fa';
import MemberCard from './MemberCard';
import { Members } from '../../../types/GroupDetails';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { fetchGroupDetailsData } from '../../../redux/slices/groupSlice';
import { mockGroupDetails } from '../../../mock/mockData';

interface MembersSectionProps {
  groupId: string;
  isAdmin: boolean;
}

const MembersSection: React.FC<MembersSectionProps> = ({ groupId, isAdmin }) => {

  const [members, setMembers] = useState<Members[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('viewer');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch group members when component mounts or groupId changes
  useEffect(() => {
    // Sử dụng mock data thay vì gọi API
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setMembers(mockGroupDetails.members || []);
      setIsLoading(false);
    }, 300);
  }, [groupId]);

  // Filter members based on search term
  const filteredMembers = members.filter(member => 
    member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.user_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle adding a new member
  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) return;
    
    setIsLoading(true);
    try {
      // Here you would typically make an API call to add the member
      // const newMember = await api.addGroupMember(groupId, newMemberEmail, newMemberRole);
      
      // Mock response for demo
      const newMember = {
        user_id: `user${members.length + 1}`,
        roles: [newMemberRole],
        name: newMemberEmail.split('@')[0],
        email: newMemberEmail,
        added_by: 'mock',
        added_date: new Date().toISOString()
      };
      
      setMembers([...members, newMember]);
      setNewMemberEmail('');
      setShowAddMemberModal(false);
    } catch (error) {
      console.error('Error adding member:', error);
      // Handle error (show notification, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  // Handle role change
  const handleRoleChange = (userId: string, newRole: string) => {
    setMembers(members.map(member => 
      member.user_id === userId 
        ? { ...member, roles: [newRole] } 
        : member
    ));
    
    // Here you would typically make an API call to update the role
    // await api.updateMemberRole(groupId, userId, newRole);
  };

  // Handle member deletion
  const handleDeleteMember = (userId: string) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      setMembers(members.filter(member => member.user_id !== userId));
      
      // Here you would typically make an API call to remove the member
      // await api.removeGroupMember(groupId, userId);
    }
  };

  return (
    <>
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
          <h5 className="mb-0">Team Members</h5>
          <div className="d-flex align-items-center">
            <div className="position-relative me-2">
              <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              <input
                type="text"
                className="form-control ps-5"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '200px' }}
              />
            </div>
            {isAdmin && (
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => setShowAddMemberModal(true)}
              >
                <FaPlus className="me-1" /> Add Member
              </Button>
            )}
          </div>
        </Card.Header>
        <Card.Body>
          <div className="d-flex flex-column gap-3">
            {filteredMembers.map(member => (
              <div key={member.user_id} className="w-100">
                <MemberCard 
                  member={member} 
                  isAdmin={isAdmin}
                  onRoleChange={handleRoleChange}
                  onDelete={handleDeleteMember}
                />
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Add Member Modal */}
      <Modal show={showAddMemberModal} onHide={() => setShowAddMemberModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Team Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email address"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Role</Form.Label>
            <Form.Select 
              value={newMemberRole} 
              onChange={(e) => setNewMemberRole(e.target.value)}
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowAddMemberModal(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAddMember}
            disabled={!newMemberEmail.trim() || isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Member'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MembersSection;
