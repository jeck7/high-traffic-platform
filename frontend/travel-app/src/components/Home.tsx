import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Rating,
} from '@mui/material';
import {
  Flight as FlightIcon,
  Hotel as HotelIcon,
  Restaurant as RestaurantIcon,
  DirectionsCar as CarIcon,
} from '@mui/icons-material';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const featuredPackages = [
    {
      id: '1',
      title: 'Paradise Beach Resort',
      destination: 'Maldives',
      price: 2500,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
      category: 'Beach',
    },
    {
      id: '2',
      title: 'Mountain Adventure',
      destination: 'Switzerland',
      price: 1800,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      category: 'Adventure',
    },
    {
      id: '3',
      title: 'City Break Paris',
      destination: 'Paris',
      price: 1200,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&h=600&fit=crop',
      category: 'Cultural',
    },
  ];

  const services = [
    {
      icon: <FlightIcon sx={{ fontSize: 40 }} />,
      title: 'Flight Booking',
      description: 'Find the best deals on flights worldwide',
    },
    {
      icon: <HotelIcon sx={{ fontSize: 40 }} />,
      title: 'Hotel Reservations',
      description: 'Book luxury hotels and resorts',
    },
    {
      icon: <RestaurantIcon sx={{ fontSize: 40 }} />,
      title: 'Dining Experiences',
      description: 'Discover local cuisine and restaurants',
    },
    {
      icon: <CarIcon sx={{ fontSize: 40 }} />,
      title: 'Transportation',
      description: 'Rent cars and arrange transfers',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                Discover Your Next Adventure
              </Typography>
              <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Explore the world with our curated travel packages
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{ bgcolor: 'white', color: 'primary.main' }}
                  onClick={() => navigate('/packages')}
                >
                  Explore Packages
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{ color: 'white', borderColor: 'white' }}
                  onClick={() => navigate('/packages')}
                >
                  Learn More
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600"
                alt="Travel"
                sx={{
                  width: '100%',
                  height: 400,
                  objectFit: 'cover',
                  borderRadius: 2,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Our Services
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
          Everything you need for a perfect trip
        </Typography>

        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.3s ease-in-out',
                  },
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {service.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {service.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {service.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Packages */}
      <Box sx={{ bgcolor: 'grey.50', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Featured Packages
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
            Handpicked destinations for your next adventure
          </Typography>

          <Grid container spacing={4}>
            {featuredPackages.map((pkg) => (
              <Grid item xs={12} sm={6} md={4} key={pkg.id}>
                <Card
                  sx={{
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      transition: 'transform 0.3s ease-in-out',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={pkg.image}
                    alt={pkg.title}
                  />
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Chip label={pkg.category} size="small" color="primary" />
                      <Rating value={pkg.rating} readOnly size="small" />
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {pkg.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      📍 {pkg.destination}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" color="primary">
                        ${pkg.price}
                      </Typography>
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => navigate('/packages')}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box textAlign="center" mt={4}>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/packages')}
            >
              View All Packages
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4} textAlign="center">
          <Grid item xs={12} sm={3}>
            <Typography variant="h3" color="primary" gutterBottom>
              10K+
            </Typography>
            <Typography variant="h6">Happy Travelers</Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="h3" color="primary" gutterBottom>
              500+
            </Typography>
            <Typography variant="h6">Destinations</Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="h3" color="primary" gutterBottom>
              24/7
            </Typography>
            <Typography variant="h6">Support</Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="h3" color="primary" gutterBottom>
              4.8★
            </Typography>
            <Typography variant="h6">Average Rating</Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 