import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './pages/Routes';
import Sidebar from './components/layouts/Sidebar';
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
          <AppRoutes />
        </ContentContainer>
      </AppContainer>
    </Router>
  );
}

export default App;
