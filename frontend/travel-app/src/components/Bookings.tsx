import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Flight as FlightIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { RootState } from '../store/store';

interface Booking {
  id: string;
  travelPackageId: string;
  travelPackageTitle: string;
  travelPackageImage: string;
  destination: string;
  bookingDate: string;
  travelersCount: number;
  totalPrice: number;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  createdAt: string;
}

const Bookings: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  // Mock bookings data
  const mockBookings: Booking[] = [
    {
      id: '1',
      travelPackageId: '1',
      travelPackageTitle: 'Sunny Beach Paradise',
      travelPackageImage: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop',
      destination: 'Bali, Indonesia',
      bookingDate: '2024-09-15',
      travelersCount: 2,
      totalPrice: 2599.98,
      status: 'CONFIRMED',
      createdAt: '2024-08-01T10:30:00Z',
    },
    {
      id: '2',
      travelPackageId: '3',
      travelPackageTitle: 'City Break in Paris',
      travelPackageImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&h=600&fit=crop',
      destination: 'Paris, France',
      bookingDate: '2024-08-05',
      travelersCount: 2,
      totalPrice: 1599.98,
      status: 'CONFIRMED',
      createdAt: '2024-07-15T14:20:00Z',
    },
    {
      id: '3',
      travelPackageId: '5',
      travelPackageTitle: 'Island Hopping',
      travelPackageImage: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop',
      destination: 'Greek Islands',
      bookingDate: '2024-12-01',
      travelersCount: 2,
      totalPrice: 3199.98,
      status: 'PENDING',
      createdAt: '2024-08-02T09:15:00Z',
    },
  ];

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setBookings(mockBookings);
      } catch (err) {
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircleIcon color="success" />;
      case 'PENDING':
        return <PendingIcon color="warning" />;
      case 'CANCELLED':
        return <CancelIcon color="error" />;
      default:
        return <PendingIcon />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 0) return true; // All bookings
    if (activeTab === 1) return booking.status === 'CONFIRMED';
    if (activeTab === 2) return booking.status === 'PENDING';
    if (activeTab === 3) return booking.status === 'CANCELLED';
    return true;
  });

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">
          Please log in to view your bookings.
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Bookings
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your travel reservations and view booking details
      </Typography>

      {/* Status Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label={`All (${bookings.length})`} />
          <Tab label={`Confirmed (${bookings.filter(b => b.status === 'CONFIRMED').length})`} />
          <Tab label={`Pending (${bookings.filter(b => b.status === 'PENDING').length})`} />
          <Tab label={`Cancelled (${bookings.filter(b => b.status === 'CANCELLED').length})`} />
        </Tabs>
      </Paper>

      {/* Bookings Grid */}
      <Grid container spacing={3}>
        {filteredBookings.map((booking) => (
          <Grid item xs={12} md={6} key={booking.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={booking.travelPackageImage}
                alt={booking.travelPackageTitle}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" gutterBottom>
                    {booking.travelPackageTitle}
                  </Typography>
                  <Chip
                    icon={getStatusIcon(booking.status)}
                    label={booking.status}
                    color={getStatusColor(booking.status) as any}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  📍 {booking.destination}
                </Typography>

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body2">
                    📅 {new Date(booking.bookingDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    👥 {booking.travelersCount} travelers
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" color="primary">
                    ${booking.totalPrice}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Booked on {new Date(booking.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>

                <Box display="flex" gap={1}>
                  <Button variant="outlined" size="small" fullWidth>
                    View Details
                  </Button>
                  {booking.status === 'PENDING' && (
                    <Button variant="contained" color="error" size="small">
                      Cancel
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredBookings.length === 0 && (
        <Box textAlign="center" py={4}>
          <FlightIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No bookings found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {activeTab === 0 
              ? "You haven't made any bookings yet."
              : `No ${activeTab === 1 ? 'confirmed' : activeTab === 2 ? 'pending' : 'cancelled'} bookings found.`
            }
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Bookings; 