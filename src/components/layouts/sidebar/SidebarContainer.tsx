// src/components/layouts/SidebarContainer.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import SidebarGroup from './SidebarGroup';
import SidebarMenu from './SidebarMenu';
import './SidebarCommon.css';

interface Position {
  x: number;
  y: number;
}

const SidebarContainer: React.FC = () => {
  // State: which sidebar is expanded, and if a group is selected
  const [groupExpanded, setGroupExpanded] = useState(true);
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState<Position>(() => {
    const saved = localStorage.getItem('menuButtonPosition');
    return saved ? JSON.parse(saved) : { x: 16, y: 16 }; // Default position
  });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isDragging = useRef(false);
  const dragOffset = useRef<Position>({ x: 0, y: 0 });
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

  const toggleMobileMenu = () => {
    if (!isDragging.current) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      isDragging.current = true;
      const rect = buttonRef.current.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging.current && buttonRef.current) {
      const maxX = window.innerWidth - buttonRef.current.offsetWidth;
      const maxY = window.innerHeight - buttonRef.current.offsetHeight;
      
      let newX = e.clientX - dragOffset.current.x;
      let newY = e.clientY - dragOffset.current.y;

      // Keep button within viewport bounds
      newX = Math.max(0, Math.min(maxX, newX));
      newY = Math.max(0, Math.min(maxY, newY));

      const newPosition = { x: newX, y: newY };
      setButtonPosition(newPosition);
      localStorage.setItem('menuButtonPosition', JSON.stringify(newPosition));
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', (e) => {
      if (isDragging.current && e.touches[0] && buttonRef.current) {
        const touch = e.touches[0];
        handleMouseMove(touch as unknown as MouseEvent);
      }
    }, { passive: false });
    document.addEventListener('touchend', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove as any);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    return () => {
      setIsMobileMenuOpen(false);
    };
  }, [navigate]);

  return (
    <>
      <button
        ref={buttonRef}
        className="mobile-menu-button"
        onClick={toggleMobileMenu}
        onMouseDown={handleMouseDown}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          handleMouseDown(touch as unknown as React.MouseEvent<HTMLButtonElement>);
        }}
        style={{
          left: `${buttonPosition.x}px`,
          top: `${buttonPosition.y}px`
        }}
      >
        <FaBars />
      </button>
      <div className={`sidebar-container-flex${isMobileMenuOpen ? ' mobile-open' : ''}`}>
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
    </>
  );
};

export default SidebarContainer;
