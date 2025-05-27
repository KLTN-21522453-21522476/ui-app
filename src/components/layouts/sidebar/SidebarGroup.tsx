// SidebarGroup.tsx
import React, { useState } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { FaUser, FaUserGroup  } from "react-icons/fa6";
import { useAuth } from '../../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { resetAuth } from '../../../redux/slices/authSlice';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { jwtUtils } from '../../../utils/jwtUtils';
import './SidebarCommon.css';

interface SidebarGroupProps {
  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onGroupSelect: () => void;
}

const SidebarGroup: React.FC<SidebarGroupProps> = ({ expanded, onExpand, onCollapse, onGroupSelect }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await dispatch(resetAuth());
    jwtUtils.clearTokens();
    sessionStorage.clear();
    localStorage.clear();
    await logout();
  };


  return (
    <div className={`sidebar${!expanded ? ' collapsed' : ''}`}>
      <div className="sidebar-menu">
        <div className="sidebar-menu-item" onClick={onGroupSelect}>
          <FaUserGroup className="sidebar-icon" />
          <span className="sidebar-label">Nhóm</span>
        </div>
        <Dropdown show={showDropdown} onToggle={setShowDropdown} className="sidebar-menu-item" drop="end">
          <Dropdown.Toggle as="div" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', background: 'none', border: 'none', padding: 0 }} id="user-dropdown">
            <FaUser className="sidebar-icon"/>
            <span className="sidebar-label">{isAuthenticated && user && user.name ? user.name : 'User'}</span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={handleLogout}>Đăng xuất</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
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
