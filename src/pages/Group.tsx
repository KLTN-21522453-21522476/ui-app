import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Dropdown } from 'react-bootstrap';
import { FaSearch, FaEllipsisV, FaPlus } from 'react-icons/fa';

interface Group {
  id: number;
  name: string;
  category: string;
  editedTime: string;
  visibility: 'Public' | 'Private';
  imageCount: number;
  modelCount: number;
  thumbnail: string;
}

const Group: React.FC = () => {
  //const [groups, setGroups] = useState<Group[]>([
  const [groups] = useState<Group[]>([
    {
      id: 1,
      name: 'YOLO',
      category: 'Object Detection',
      editedTime: 'a month ago',
      visibility: 'Public',
      imageCount: 864,
      modelCount: 2,
      thumbnail: '/path-to-thumbnail1.jpg'
    },
    {
      id: 2,
      name: 'bill detect',
      category: 'Object Detection',
      editedTime: '10 months ago',
      visibility: 'Public',
      imageCount: 869,
      modelCount: 1,
      thumbnail: '/path-to-thumbnail2.jpg'
    },
    {
      id: 3,
      name: 'Bills Detect',
      category: 'Object Detection',
      editedTime: 'a year ago',
      visibility: 'Public',
      imageCount: 886,
      modelCount: 0,
      thumbnail: '/path-to-thumbnail3.jpg'
    },
    {
      id: 4,
      name: 'bill',
      category: 'Object Detection',
      editedTime: 'a year ago',
      visibility: 'Public',
      imageCount: 837,
      modelCount: 0,
      thumbnail: '/path-to-thumbnail4.jpg'
    },
    {
      id: 5,
      name: 'Yolov5',
      category: 'Object Detection',
      editedTime: 'a year ago',
      visibility: 'Public',
      imageCount: 8,
      modelCount: 0,
      thumbnail: '/path-to-thumbnail5.jpg'
    },
    {
      id: 6,
      name: 'Hard Hat Sample',
      category: 'Object Detection',
      editedTime: 'a year ago',
      visibility: 'Private',
      imageCount: 100,
      modelCount: 0,
      thumbnail: '/path-to-thumbnail6.jpg'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Ngày tạo');

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Nhóm</h2>
        <div className="d-flex">
          {/* <Button variant="outline-secondary" className="me-2">
            <span className="d-flex align-items-center">
              <i className="bi bi-person-plus me-1"></i> Invite Members
            </span>
          </Button> */}
          <Button variant="primary">
            <FaPlus className="me-1" /> Tạo nhóm mới
          </Button>
        </div>
      </div>

      <div className="d-flex justify-content-between mb-4">
        <InputGroup style={{ maxWidth: '250px' }}>
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Tìm nhóm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <Dropdown>
          <Dropdown.Toggle variant="outline-secondary" id="dropdown-sort">
            Sắp xếp theo: {sortBy}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setSortBy('Ngày tạo')}>Ngày tạo</Dropdown.Item>
            <Dropdown.Item onClick={() => setSortBy('Tên')}>Tên</Dropdown.Item>
            <Dropdown.Item onClick={() => setSortBy('Số lượng hoá đơn')}>Số lượng hoá đơn</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
        {groups.map((group) => (
          <Col key={group.id}>
            <Card className="h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="text-muted small">{group.category}</div>
                    <Card.Title className="mb-0 d-flex align-items-center">
                      <span className="me-1">@</span> {group.name}
                    </Card.Title>
                  </div>
                  <Button variant="link" className="p-0 text-dark">
                    <FaEllipsisV />
                  </Button>
                </div>
                <div className="mt-2 small text-muted">
                  Edited {group.editedTime}
                </div>
                <div className="d-flex mt-2">
                  <div className="small text-muted me-3">
                    {group.visibility} • {group.imageCount} Images • {group.modelCount} Models
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>

  );
};

export default Group;
