import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

interface AddMemberModalProps {
  show: boolean;
  onHide: () => void;
  email: string;
  role: string;
  onEmailChange: (email: string) => void;
  onRoleChange: (role: string) => void;
  onAdd: () => void;
  isProcessing?: boolean;
  error?: string | null;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({
  show,
  onHide,
  email,
  role,
  onEmailChange,
  onRoleChange,
  onAdd,
  isProcessing = false,
  error,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Thêm thành viên</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Nhập email thành viên"
            value={email}
            onChange={e => onEmailChange(e.target.value)}
            disabled={isProcessing}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Vai trò</Form.Label>
          <Form.Select 
            value={role} 
            onChange={e => onRoleChange(e.target.value)}
            disabled={isProcessing}
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </Form.Select>
        </Form.Group>
        {error && <div className="text-danger mt-2">{error}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isProcessing}>
          Huỷ
        </Button>
        <Button variant="primary" onClick={onAdd} disabled={isProcessing || !email}>
          {isProcessing ? 'Đang thêm...' : 'Thêm thành viên'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddMemberModal;
