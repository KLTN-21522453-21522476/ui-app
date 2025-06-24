import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from './hooks/useAuth';
import AppRoutes from './pages/Routes';
import SidebarContainer from './components/layouts/sidebar/SidebarContainer';
import styled from 'styled-components';
import Header from './components/layouts/Header';

const AppContainer = styled.div`
    display: flex;
    height: 100vh;
    position: relative;
    overflow: hidden;
`;

const ContentContainer = styled.div<{ isMobileMenuOpen?: boolean }>`
    flex-grow: 1;
    overflow: auto;
    transition: transform 0.3s ease;

    @media (max-width: 768px) {
        transform: translateX(${props => props.isMobileMenuOpen ? '56px' : '0'});
        margin-left: 0;
    }
`;

const AppLayout: React.FC = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const { checkAuth, isInitialized } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (isMobileMenuOpen && !target.closest('.sidebar-container-flex') && !target.closest('.mobile-menu-button')) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMobileMenuOpen]);

    if (!isInitialized) {
        // Optionally show a loading spinner or splash screen
        return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}>Đang kiểm tra phiên đăng nhập...</div>;
    }

    return (
      <AppContainer>
        {!isHomePage && <SidebarContainer />}
        <ContentContainer isMobileMenuOpen={isMobileMenuOpen}>
          {isHomePage && <Header />}
          <AppRoutes />
        </ContentContainer>
      </AppContainer>
    );
};

export default AppLayout;