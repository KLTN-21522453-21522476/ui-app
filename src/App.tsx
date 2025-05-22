import { BrowserRouter as Router } from 'react-router-dom';
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

function App() {
  return (
    <Router>
        <AppContainer>
          <SidebarContainer />
          <ContentContainer>
            <Header/>
            <AppRoutes />
          </ContentContainer>
        </AppContainer>  
    </Router>
  );
}

export default App;
