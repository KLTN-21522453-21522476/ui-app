import { useLocation } from 'react-router-dom';
import AppRoutes from './pages/Routes';
import SidebarContainer from './components/layouts/SidebarContainer';
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