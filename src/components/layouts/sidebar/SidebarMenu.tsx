// SidebarMenu.tsx
import React from 'react';
import { Button } from 'react-bootstrap';
import { FaChartLine, FaUpload, FaCamera } from "react-icons/fa6";
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
          <FaChartLine className="sidebar-icon" />
          <span className="sidebar-label">Dashboard</span>
        </div>
        <div className="sidebar-menu-item" onClick={() => onNavigate('/upload-invoice')}>
          <FaUpload className="sidebar-icon" />
          <span className="sidebar-label">Upload Hóa đơn</span>
        </div>
        <div className="sidebar-menu-item" onClick={() => onNavigate('/invoice-capture')}>
          <FaCamera className="sidebar-icon" />
          <span className="sidebar-label">Chụp Hóa đơn</span>
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
