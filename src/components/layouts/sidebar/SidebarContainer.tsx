// src/components/layouts/SidebarContainer.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarGroup from './SidebarGroup';
import SidebarMenu from './SidebarMenu';
import './SidebarCommon.css';

const SidebarContainer: React.FC = () => {
  // State: which sidebar is expanded, and if a group is selected
  const [groupExpanded, setGroupExpanded] = useState(true);
const [menuExpanded, setMenuExpanded] = useState(false);
const navigate = useNavigate();

const handleExpandGroup = () => setGroupExpanded(true);
const handleCollapseGroup = () => setGroupExpanded(false);
const handleExpandMenu = () => setMenuExpanded(true);
const handleCollapseMenu = () => setMenuExpanded(false);

const handleGroupSelect = () => {
  navigate('/groups');
};
const handleMenuNavigate = (path: string) => {
  navigate(path);
};

return (
  <div className="sidebar-container-flex">
    <SidebarGroup
      expanded={groupExpanded}
      onExpand={handleExpandGroup}
      onCollapse={handleCollapseGroup}
      onGroupSelect={handleGroupSelect}
    />
    <SidebarMenu
      expanded={menuExpanded}
      onExpand={handleExpandMenu}
      onCollapse={handleCollapseMenu}
      onNavigate={handleMenuNavigate}
    />
  </div>
);
};

export default SidebarContainer;
