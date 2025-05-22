// src/components/layouts/SidebarMenu.tsx
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
    <div className={`sidebar sidebar-menu${!expanded ? ' sidebar-menu-collapsed' : ''}`}>
      {expanded ? (
        <>
        <div className="sidebar-menu">
          <div className="sidebar-menu-item" onClick={() => onNavigate('/dashboard')}>
            <AiOutlineHome style={{ marginRight: 8 }} /> Dashboard
          </div>
          <div className="sidebar-menu-item" onClick={() => onNavigate('/')}> 
            <AiOutlineLayout style={{ marginRight: 8 }} /> Upload Hoá đơn
          </div>
        </div>
          <Button variant="light" size="sm" className="sidebar-toggle" onClick={onCollapse} aria-label="Collapse sidebar">
            <FiChevronLeft />
          </Button>
        </>
      ) : (
        <Button variant="light" size="sm" className="sidebar-toggle" onClick={onExpand} aria-label="Expand sidebar">
          <FiChevronRight />
      </Button>
      )}     
    </div>
  );
};

export default SidebarMenu;
