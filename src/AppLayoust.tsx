import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import AppRoutes from './pages/Routes';
import SidebarContainer from './components/layouts/sidebar/SidebarContainer';
import styled from 'styled-components';
import Header from './components/layouts/Header';

const AppContainer = styled.div`
    display: flex;
    height: 100vh;
`;

const ContentContainer = styled.div`
    flex-grow: 1;
    overflow: auto;
`;

const AppLayout: React.FC = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const { checkAuth, isInitialized } = useAuth();

    useEffect(() => {
        checkAuth();
    }, []);

    if (!isInitialized) {
        // Optionally show a loading spinner or splash screen
        return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}>Đang kiểm tra phiên đăng nhập...</div>;
    }

    return (
      <AppContainer>
        {!isHomePage && <SidebarContainer />}
        <ContentContainer>
          {isHomePage && <Header />}
          <AppRoutes />
        </ContentContainer>
      </AppContainer>
    );
};

export default AppLayout;