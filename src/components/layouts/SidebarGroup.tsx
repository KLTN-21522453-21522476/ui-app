// src/components/layouts/SidebarGroup.tsx
import React from 'react';
import { Button } from 'react-bootstrap';
import { AiOutlineLayout } from 'react-icons/ai';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './SidebarCommon.css';

interface SidebarGroupProps {
  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onGroupSelect: () => void; // Only expand/collapse, not navigation
}

const SidebarGroup: React.FC<SidebarGroupProps> = ({ expanded, onExpand, onCollapse, onGroupSelect }) => {
  return (
    <div className={`sidebar sidebar-group${!expanded ? ' sidebar-group-collapsed' : ''}`}>
      <div className="sidebar-menu" style={{ opacity: expanded ? 1 : 0 }}>
        <div className="sidebar-menu-item" onClick={onGroupSelect}>
          <AiOutlineLayout style={{ marginRight: 8 }} /> Group
        </div>
      </div>
      <Button 
        variant="light" 
        size="sm" 
        className="sidebar-toggle" 
        onClick={expanded ? onCollapse : onExpand} 
        aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        {expanded ? <FiChevronLeft /> : <FiChevronRight />}
      </Button>
    </div>
  );
};

export default SidebarGroup;
