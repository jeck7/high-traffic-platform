import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
  Flight as FlightIcon,
  BookOnline as BookOnlineIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { RootState, AppDispatch } from '../store/store';
import { logout } from '../store/slices/authSlice';

const Navigation: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      handleMenuClose();
      await dispatch(logout('dummy-refresh-token'));
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout even if API fails
      navigate('/');
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Travel Packages', icon: <FlightIcon />, path: '/packages' },
    { text: 'My Bookings', icon: <BookOnlineIcon />, path: '/bookings' },
    { text: 'Travel History', icon: <HistoryIcon />, path: '/history' },
  ];

  const authMenuItems = [
    { text: 'Login', icon: <PersonIcon />, path: '/login' },
    { text: 'Register', icon: <PersonIcon />, path: '/register' },
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" color="primary">
          Travel Platform
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        {!isAuthenticated && (
          <>
            <Divider />
            {authMenuItems.map((item) => (
              <ListItem 
                button 
                key={item.text}
                onClick={() => handleNavigation(item.path)}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            Travel Platform
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit">
              <SearchIcon />
            </IconButton>

            <IconButton color="inherit">
              <Badge badgeContent={3} color="error">
                <FavoriteIcon />
              </Badge>
            </IconButton>

            {isAuthenticated ? (
              <>
                <IconButton
                  onClick={handleMenuOpen}
                  color="inherit"
                >
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                                  <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
                  <PersonIcon sx={{ mr: 1 }} />
                  Profile
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <SettingsIcon sx={{ mr: 1 }} />
                  Settings
                </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button 
                color="inherit" 
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navigation; 