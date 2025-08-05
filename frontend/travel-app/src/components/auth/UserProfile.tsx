import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  TextField,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Chip,
  Container,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  Edit,
  Save,
  Cancel,
  Security,
  Notifications,
  Language,
  Palette,
  Logout,
} from '@mui/icons-material';
import { RootState, AppDispatch } from '../../store/store';
import { logout, updateUser } from '../../store/slices/authSlice';

const UserProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    preferredLanguage: user?.preferredLanguage || 'en',
    timezone: user?.timezone || 'UTC',
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      preferredLanguage: user?.preferredLanguage || 'en',
      timezone: user?.timezone || 'UTC',
    });
  };

  const handleSave = async () => {
    try {
      await dispatch(updateUser(editData));
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout('dummy-refresh-token'));
      // Navigate to home after logout
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout even if API fails
      window.location.href = '/';
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase();
  };

  const getMemberSince = (createdAt?: string) => {
    if (!createdAt) return 'N/A';
    const date = new Date(createdAt);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  if (!user) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Profile
        </Typography>

        <Grid container spacing={3}>
          {/* Profile Header */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={3}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    fontSize: '2rem',
                    bgcolor: 'primary.main',
                  }}
                >
                  {getInitials(user.firstName, user.lastName)}
                </Avatar>
                <Box flex={1}>
                  <Typography variant="h5" gutterBottom>
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Member since {getMemberSince(user.createdAt)}
                  </Typography>
                  <Box display="flex" gap={1} mt={1}>
                    <Chip
                      label={user.isEmailVerified ? 'Verified' : 'Unverified'}
                      color={user.isEmailVerified ? 'success' : 'warning'}
                      size="small"
                    />
                    <Chip
                      label={user.roles?.join(', ') || 'User'}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={handleEdit}
                  disabled={isEditing}
                >
                  Edit Profile
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Profile Details */}
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={isEditing ? editData.firstName : (user.firstName || '')}
                    onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: (
                        <Person color="action" sx={{ mr: 1 }} />
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={isEditing ? editData.lastName : (user.lastName || '')}
                    onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: (
                        <Person color="action" sx={{ mr: 1 }} />
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={isEditing ? editData.email : user.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: (
                        <Email color="action" sx={{ mr: 1 }} />
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={isEditing ? editData.phoneNumber : (user.phoneNumber || '')}
                    onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: (
                        <Phone color="action" sx={{ mr: 1 }} />
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              {isEditing && (
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={isLoading}
                  >
                    {isLoading ? <CircularProgress size={20} /> : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Settings Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Settings
              </Typography>
              
              <List>
                <ListItem button>
                  <ListItemIcon>
                    <Security />
                  </ListItemIcon>
                  <ListItemText primary="Security Settings" />
                </ListItem>
                
                <ListItem button>
                  <ListItemIcon>
                    <Notifications />
                  </ListItemIcon>
                  <ListItemText primary="Notification Preferences" />
                </ListItem>
                
                <ListItem button>
                  <ListItemIcon>
                    <Language />
                  </ListItemIcon>
                  <ListItemText primary="Language Settings" />
                </ListItem>
                
                <ListItem button>
                  <ListItemIcon>
                    <Palette />
                  </ListItemIcon>
                  <ListItemText primary="Theme Settings" />
                </ListItem>
              </List>

              <Divider sx={{ my: 2 }} />

              <Button
                fullWidth
                variant="outlined"
                color="error"
                startIcon={<Logout />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default UserProfile; 