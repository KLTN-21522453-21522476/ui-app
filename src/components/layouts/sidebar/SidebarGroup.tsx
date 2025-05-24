// SidebarGroup.tsx
import React from 'react';
import { Button } from 'react-bootstrap';
import { MdGroup } from 'react-icons/md';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './SidebarCommon.css';

interface SidebarGroupProps {
  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onGroupSelect: () => void;
}

const SidebarGroup: React.FC<SidebarGroupProps> = ({ expanded, onExpand, onCollapse, onGroupSelect }) => {
  return (
    <div className={`sidebar${!expanded ? ' collapsed' : ''}`}>
      <div className="sidebar-menu">
        <div className="sidebar-menu-item" onClick={onGroupSelect}>
          <MdGroup className="sidebar-icon" />
          <span className="sidebar-label">Nhóm</span>
        </div>
      </div>

      <Button
        variant="light"
        size="sm"
        className="sidebar-toggle"
        onClick={expanded ? onCollapse : onExpand}
        aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {expanded ? <FiChevronLeft /> : <FiChevronRight />}
      </Button>
    </div>
  );
};

export default SidebarGroup;
