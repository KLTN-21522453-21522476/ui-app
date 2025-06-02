import { BrowserRouter as Router } from 'react-router-dom';
import AppLayout from './AppLayoust';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CameraProvider } from './contexts/CameraContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CameraProvider>
        <Router>
          <AppLayout />
        </Router>
      </CameraProvider>
    </ThemeProvider>
  );
}

export default App;
