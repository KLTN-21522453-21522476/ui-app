// src/components/group/GroupFilters.tsx
import React from 'react';
import { InputGroup, Form, Dropdown } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

interface GroupFiltersProps {
  searchTerm: string;
  sortBy: string;
  onSearchChange: (term: string) => void;
  onSortChange: (sortOption: string) => void;
}

export const GroupFilters: React.FC<GroupFiltersProps> = ({
  searchTerm,
  sortBy,
  onSearchChange,
  onSortChange
}) => {
  return (
    <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center gap-3 mb-4">
      <div className="d-flex flex-column flex-md-row gap-3 gap-md-3 w-100 justify-content-md-end">
        {/* Mobile Search */}
        <div className="d-md-none w-100">
          <InputGroup>
            <InputGroup.Text className="bg-white border-end-0">
              <FaSearch className="text-muted" />
            </InputGroup.Text>
            <Form.Control
              className="border-start-0 shadow-none"
              placeholder="Tìm nhóm"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </InputGroup>
        </div>

        {/* Desktop Search */}
        <div className="d-none d-md-block" style={{ width: '250px' }}>
          <InputGroup>
            <InputGroup.Text className="bg-white border-end-0">
              <FaSearch className="text-muted" />
            </InputGroup.Text>
            <Form.Control
              className="border-start-0 shadow-none"
              placeholder="Tìm nhóm"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </InputGroup>
        </div>

        <Dropdown align={{ xs: 'end' }}>
          <Dropdown.Toggle 
            variant="outline-secondary" 
            id="dropdown-sort"
            className="w-100 w-md-auto"
            style={{ width: '160px' }}
          >
            Sắp xếp theo: {sortBy}
          </Dropdown.Toggle>
          <Dropdown.Menu style={{ width: '160px' }}>
            <Dropdown.Item onClick={() => onSortChange('Ngày tạo')}>Ngày tạo</Dropdown.Item>
            <Dropdown.Item onClick={() => onSortChange('Tên')}>Tên</Dropdown.Item>
            <Dropdown.Item onClick={() => onSortChange('Số lượng hoá đơn')}>Số lượng hoá đơn</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};