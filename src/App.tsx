import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './pages/Routes';
import Sidebar from './components/layouts/Sidebar';
import Header from './components/layouts/Header';
import styled from 'styled-components';

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
        <Sidebar />
        <ContentContainer>
          <Header />
          <AppRoutes />
        </ContentContainer>
      </AppContainer>
    </Router>
  );
}

export default App;
