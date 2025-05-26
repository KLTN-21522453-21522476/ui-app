// src/components/group/GroupModals.tsx
import React from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { FaTrash, FaPlus, FaEdit } from 'react-icons/fa';
import { GroupModalState } from '../../../types/GroupDetails';

interface GroupModalsProps {
  modalState: GroupModalState;
  onClose: () => void;
  onDelete: () => void;
  onCreate: () => void;
  onRename: () => void;
  onLeave: () => void;
  onUpdateCreateName: (name: string) => void;
  onUpdateRenameName: (name: string) => void;
  onUpdateCreateDescription: (description: string) => void;
}

export const GroupModals: React.FC<GroupModalsProps> = ({
  modalState,
  onClose,
  onDelete,
  onCreate,
  onRename,
  onLeave,
  onUpdateCreateName,
  onUpdateRenameName,
  onUpdateCreateDescription
}) => {
  return (
    <>
      {/* Modal xác nhận xoá */}
      <Modal show={modalState.delete.show} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xoá nhóm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xoá nhóm "{modalState.delete.group?.name}"?
          <div className="text-muted mt-2 small">
            Hành động này không thể hoàn tác và tất cả dữ liệu liên quan đến nhóm này sẽ bị xoá.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose} disabled={modalState.delete.isProcessing}>
            Huỷ
          </Button>
          <Button 
            variant="danger" 
            onClick={onDelete} 
            disabled={modalState.delete.isProcessing}
          >
            {modalState.delete.isProcessing ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Đang xoá...
              </>
            ) : (
              <>
                <FaTrash className="me-2" />
                Xoá
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal xác nhận rời nhóm */}
      <Modal show={modalState.leave.show} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận rời nhóm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn rời nhóm "{modalState.leave.group?.name}"?
          <div className="text-muted mt-2 small">
            Sau khi rời nhóm, bạn sẽ mất quyền truy cập vào tất cả dữ liệu và hoạt động trong nhóm này.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose} disabled={modalState.leave.isProcessing}>
            Huỷ
          </Button>
          <Button 
            variant="danger" 
            onClick={onLeave} 
            disabled={modalState.leave.isProcessing}
          >
            {modalState.leave.isProcessing ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Đang xử lý...
              </>
            ) : (
              <>Rời nhóm</>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal tạo nhóm mới */}
      <Modal show={modalState.create.show} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Tạo nhóm mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            e.preventDefault();
            onCreate();
          }}>
            <Form.Group className="mb-3">
              <Form.Label>Tên nhóm</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên nhóm"
                value={modalState.create.name}
                onChange={(e) => onUpdateCreateName(e.target.value)}
                autoFocus
              />
              <Form.Text className="text-muted">
                Tên nhóm nên dễ nhớ và mô tả được mục đích của nhóm.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mô tả nhóm</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Mô tả mục đích và hoạt động của nhóm"
                value={modalState.create.description || ''}
                onChange={(e) => onUpdateCreateDescription(e.target.value)}
              />
              <Form.Text className="text-muted">
                Mô tả ngắn gọn về mục đích và hoạt động của nhóm.
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose} disabled={modalState.create.isProcessing}>
            Huỷ
          </Button>
          <Button 
            variant="primary" 
            onClick={onCreate} 
            disabled={modalState.create.isProcessing || !modalState.create.name.trim()}
          >
            {modalState.create.isProcessing ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Đang tạo...
              </>
            ) : (
              <>
                <FaPlus className="me-2" />
                Tạo nhóm
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal đổi tên nhóm */}
      <Modal show={modalState.rename.show} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Đổi tên nhóm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            e.preventDefault();
            onRename();
          }}>
            <Form.Group className="mb-3">
              <Form.Label>Tên nhóm mới</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên nhóm mới"
                value={modalState.rename.newName}
                onChange={(e) => onUpdateRenameName(e.target.value)}
                autoFocus
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onClose} disabled={modalState.rename.isProcessing}>
                Huỷ
            </Button>
            <Button 
                variant="primary" 
                onClick={onRename} 
                disabled={
                    modalState.rename.isProcessing || 
                    !modalState.rename.newName.trim() || 
                    (modalState.rename.group ? modalState.rename.newName === modalState.rename.group.name : false)
                }
            >
            {modalState.rename.isProcessing ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Đang cập nhật...
              </>
            ) : (
              <>
                <FaEdit className="me-2" />
                Cập nhật
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
