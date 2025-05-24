// SidebarMenu.tsx
import React from 'react';
import { Button } from 'react-bootstrap';
import { AiOutlineHome, AiOutlineLayout } from 'react-icons/ai';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './SidebarCommon.css';

interface SidebarMenuProps {
  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onNavigate: (path: string) => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ expanded, onExpand, onCollapse, onNavigate }) => {
  return (
    <div className={`sidebar${!expanded ? ' collapsed' : ''}`}>
      <div className="sidebar-menu">
        <div className="sidebar-menu-item" onClick={() => onNavigate('/dashboard')}>
          <AiOutlineHome className="sidebar-icon" />
          <span className="sidebar-label">Dashboard</span>
        </div>
        <div className="sidebar-menu-item" onClick={() => onNavigate('/upload-invoice')}>
          <AiOutlineLayout className="sidebar-icon" />
          <span className="sidebar-label">Upload Hóa đơn</span>
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

export default SidebarMenu;
