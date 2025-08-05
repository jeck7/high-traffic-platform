import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Navigation from './components/Navigation';
import Home from './components/Home';
import TravelPackages from './components/TravelPackages';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import UserProfile from './components/auth/UserProfile';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navigation />
            <Box component="main" sx={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/packages" element={<TravelPackages />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App; 