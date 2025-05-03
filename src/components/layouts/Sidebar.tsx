// src/components/layouts/Sidebar.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  AiOutlineHome, 
  //AiOutlineTable, 
  //AiOutlineForm, 
  AiOutlineLayout,
  //AiOutlineMenu,
  //AiOutlineAppstore,
  //AiOutlineFile
} from 'react-icons/ai';
// import { 
//   BiMap, 
//   BiLineChart
// } from 'react-icons/bi';
import { MdOutlineExpandMore } from 'react-icons/md';
import { Image } from 'react-bootstrap';


interface MenuItem {
  title: string;
  icon: React.ReactNode;
  expandable?: boolean;
  badge?: number;
  path?: string;
}

const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background-color: #1e2233;
  color: #a0a3b8;
  display: flex;
  flex-direction: column;
  padding-top: 20px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const LogoImage = styled(Image)`
  width: 40px;
  height: 40px;
  margin-right: 12px;
  filter: brightness(1.2);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const BrandName = styled.div`
  display: flex;
  flex-direction: column;
`;

const PrimaryText = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: white;
  letter-spacing: 0.5px;
`;

const SecondaryText = styled.span`
  font-size: 12px;
  color: #a0a3b8;
  margin-top: 2px;
  letter-spacing: 0.5px;
`;

const MenuItem = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  position: relative;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  ${props => props.active && `
    background-color: rgba(255, 255, 255, 0.05);
    border-left: 3px solid #6366f1;
  `}
`;

const MenuIcon = styled.div`
  margin-right: 10px;
  font-size: 18px;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MenuText = styled.div`
  flex-grow: 1;
`;

const ExpandIcon = styled.div`
  font-size: 18px;
`;

const Badge = styled.div`
  background-color: #6366f1;
  color: white;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: bold;
`;



const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems: MenuItem[] = [
    { title: 'Bảng Điều Khiển', icon: <AiOutlineHome />, path: '/dashboard' },
    { title: 'Upload Hoá Đơn', icon: <AiOutlineLayout />, path: '/'},
    { title: 'Nhóm', icon: <AiOutlineLayout />, path: '/'},
    { title: 'Sidebar Layouts', icon: <AiOutlineLayout />, expandable: true },
    // { title: 'Forms', icon: <AiOutlineForm />, expandable: true },
    // { title: 'Tables', icon: <AiOutlineTable />, expandable: true },
    // { title: 'Maps', icon: <BiMap />, expandable: true },
    // { title: 'Charts', icon: <BiLineChart />, expandable: true },
    // { title: 'Widgets', icon: <AiOutlineAppstore />, badge: 4 },
    // { title: 'Documentation', icon: <AiOutlineFile />, badge: 1 },
    // { title: 'Menu Levels', icon: <AiOutlineMenu />, expandable: true },
  ];
  
  const handleMenuClick = (item: MenuItem) => {
    if (item.path) {
      navigate(item.path);
    }
    // Xử lý menu mở rộng nếu cần
  };
  
  return (
    <SidebarContainer>
      <Logo>
        <LogoImage
          src="/bill.png"
          alt="Bill Extraction"
          roundedCircle
        />
        <BrandName>
          <PrimaryText>Hoá Đơn AI</PrimaryText>
          <SecondaryText>Trích xuất thông minh</SecondaryText>
        </BrandName>
      </Logo>
      
      {menuItems.map((item) => (
        <MenuItem 
          key={item.title}
          active={item.path === location.pathname}
          onClick={() => handleMenuClick(item)}
        >
          <MenuIcon>{item.icon}</MenuIcon>
          <MenuText>{item.title}</MenuText>
          {item.expandable && (
            <ExpandIcon>
              <MdOutlineExpandMore />
            </ExpandIcon>
          )}
          {item.badge && <Badge>{item.badge}</Badge>}
        </MenuItem>
      ))}
    </SidebarContainer>
  );
};

export default Sidebar;
