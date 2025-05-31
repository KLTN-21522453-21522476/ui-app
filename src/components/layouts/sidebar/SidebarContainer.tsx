// src/components/layouts/SidebarContainer.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; // Thêm icon đóng
import SidebarGroup from './SidebarGroup';
import SidebarMenu from './SidebarMenu';
import './SidebarCommon.css';

interface Position {
  x: number;
  y: number;
}

interface Velocity {
  x: number;
  y: number;
}

const SidebarContainer: React.FC = () => {
  // State: which sidebar is expanded, and if a group is selected
  const [groupExpanded, setGroupExpanded] = useState(true);
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState<Position>({ x: 16, y: 16 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragOffset = useRef<Position>({ x: 0, y: 0 });
  const lastTouchTime = useRef<number>(0);
  const lastTouchPosition = useRef<Position>({ x: 0, y: 0 });
  const velocity = useRef<Velocity>({ x: 0, y: 0 });
  const animationFrame = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);
  const moveCount = useRef(0);
  const touchStartPosition = useRef<Position>({ x: 0, y: 0 });
  const navigate = useNavigate();

  const handleExpandGroup = () => setGroupExpanded(true);
  const handleCollapseGroup = () => setGroupExpanded(false);
  const handleExpandMenu = () => setMenuExpanded(true);
  const handleCollapseMenu = () => setMenuExpanded(false);

  const handleGroupSelect = () => navigate('/groups');
  const handleMenuNavigate = (path: string) => navigate(path);

  // Cập nhật hàm toggleMobileMenu
  const toggleMobileMenu = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (!isDragging.current) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    }
  };

  const snapToEdge = (x: number, y: number): Position => {
    if (!buttonRef.current) return { x, y };
    
    const buttonWidth = buttonRef.current.offsetWidth;
    const buttonHeight = buttonRef.current.offsetHeight;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const threshold = screenWidth * 0.5;
    
    // Snap to left or right edge
    const newX = x < threshold ? 16 : screenWidth - buttonWidth - 16;
    
    // Keep Y within bounds
    const newY = Math.max(16, Math.min(screenHeight - buttonHeight - 16, y));
    
    return { x: newX, y: newY };
  };

  const applyInertia = () => {
    if (!isDragging.current && (Math.abs(velocity.current.x) > 0.1 || Math.abs(velocity.current.y) > 0.1)) {
      setButtonPosition(prev => {
        const newX = prev.x + velocity.current.x;
        const newY = prev.y + velocity.current.y;
        const snapped = snapToEdge(newX, newY);
        
        // Apply friction
        velocity.current.x *= 0.95;
        velocity.current.y *= 0.95;
        
        return snapped;
      });
      
      animationFrame.current = requestAnimationFrame(applyInertia);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    const touch = e.touches[0];
    touchStartTime.current = Date.now();
    touchStartPosition.current = { x: touch.clientX, y: touch.clientY };
    moveCount.current = 0;
    lastTouchTime.current = Date.now();
    lastTouchPosition.current = { x: touch.clientX, y: touch.clientY };
    
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      dragOffset.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    }
    
    // Cancel any ongoing animation
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    if (e.touches[0]) {
      moveCount.current++;
      const touch = e.touches[0];
      const currentTime = Date.now();
      const timeElapsed = currentTime - lastTouchTime.current;
      
      // Tính khoảng cách di chuyển từ điểm bắt đầu
      const moveDistance = Math.sqrt(
        Math.pow(touch.clientX - touchStartPosition.current.x, 2) +
        Math.pow(touch.clientY - touchStartPosition.current.y, 2)
      );
      
      // Chỉ coi là đang kéo nếu di chuyển đủ xa (ngưỡng 10px)
      if (moveDistance > 10) {
        isDragging.current = true;
      }
      
      if (timeElapsed > 0) {
        velocity.current = {
          x: (touch.clientX - lastTouchPosition.current.x) / timeElapsed * 16,
          y: (touch.clientY - lastTouchPosition.current.y) / timeElapsed * 16
        };
      }
      
      lastTouchTime.current = currentTime;
      lastTouchPosition.current = { x: touch.clientX, y: touch.clientY };

      if (isDragging.current) {
        const newX = touch.clientX - dragOffset.current.x;
        const newY = touch.clientY - dragOffset.current.y;
        setButtonPosition({ x: newX, y: newY });
      }
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    
    const touchDuration = Date.now() - touchStartTime.current;
    const wasShortTouch = touchDuration < 300; // Ngưỡng thời gian cho tap
    
    if (isDragging.current) {
      // Start inertia animation
      applyInertia();
      
      // Snap to nearest edge
      setButtonPosition(prev => snapToEdge(prev.x, prev.y));
    } else if (wasShortTouch) {
      // Nếu là tap ngắn và không phải drag, thì toggle menu
      setIsMobileMenuOpen(!isMobileMenuOpen);
    }
    
    // Reset trạng thái
    isDragging.current = false;
    moveCount.current = 0;
  };

  // Thêm hàm xử lý click bên ngoài sidebar để đóng sidebar
  const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
    if (
      isMobileMenuOpen && 
      sidebarRef.current && 
      !sidebarRef.current.contains(e.target as Node) &&
      buttonRef.current && 
      !buttonRef.current.contains(e.target as Node)
    ) {
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    const button = buttonRef.current;
    if (button) {
      button.addEventListener('touchmove', handleTouchMove, { passive: false });
      button.addEventListener('touchend', handleTouchEnd, { passive: false });
    }

    // Thêm event listener để đóng sidebar khi click bên ngoài
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick, { passive: true });

    return () => {
      if (button) {
        button.removeEventListener('touchmove', handleTouchMove);
        button.removeEventListener('touchend', handleTouchEnd);
      }
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [isMobileMenuOpen]); // Thêm isMobileMenuOpen vào dependencies

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
        onTouchStart={handleTouchStart}
        style={{
          left: `${buttonPosition.x}px`,
          top: `${buttonPosition.y}px`,
          transform: 'translate3d(0,0,0)',
          transition: isDragging.current ? 'none' : 'all 0.3s ease'
        }}
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>
      
      <div 
        ref={sidebarRef}
        className={`sidebar-container-flex${isMobileMenuOpen ? ' mobile-open' : ''}`}
        onClick={(e) => e.stopPropagation()} // Ngăn sự kiện click lan truyền
      >
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
      
      {/* Thêm overlay để chặn các sự kiện bên dưới khi sidebar mở */}
      {isMobileMenuOpen && (
        <div className="sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </>
  );
};

export default SidebarContainer;
