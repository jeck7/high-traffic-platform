import React, { useEffect, useState } from 'react';
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
  CircularProgress,
} from '@mui/material';
import {
  Flight as FlightIcon,
  Hotel as HotelIcon,
  Restaurant as RestaurantIcon,
  DirectionsCar as CarIcon,
} from '@mui/icons-material';

interface FeaturedPackage {
  id: string;
  title: string;
  destination: string;
  price: number;
  rating: number;
  image: string;
  category: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [featuredPackages, setFeaturedPackages] = useState<FeaturedPackage[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock fallback data
  const mockFeaturedPackages = [
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

  useEffect(() => {
    const fetchFeaturedPackages = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/api/v1/travel/packages/featured', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          setFeaturedPackages(data.packages || mockFeaturedPackages);
        } else {
          setFeaturedPackages(mockFeaturedPackages);
        }
      } catch (error) {
        console.error('Failed to fetch featured packages:', error);
        setFeaturedPackages(mockFeaturedPackages);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPackages();
  }, []);

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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

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
                  onClick={() => navigate('/packages')}
                  sx={{ 
                    backgroundColor: 'white', 
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'grey.100',
                    }
                  }}
                >
                  Explore Packages
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{ 
                    borderColor: 'white', 
                    color: 'white',
                    '&:hover': {
                      borderColor: 'grey.100',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop"
                alt="Travel"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Featured Packages Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" gutterBottom align="center">
          Featured Packages
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom align="center" sx={{ mb: 6 }}>
          Handpicked destinations for your next adventure
        </Typography>
        
        <Grid container spacing={4}>
          {featuredPackages.map((pkg) => (
            <Grid item xs={12} md={4} key={pkg.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  }
                }}
                onClick={() => navigate(`/packages/${pkg.id}`)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={pkg.image}
                  alt={pkg.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {pkg.title}
                    </Typography>
                    <Chip label={pkg.category} size="small" color="primary" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {pkg.destination}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={pkg.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {pkg.rating}
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="primary">
                      ${pkg.price}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Services Section */}
      <Box sx={{ backgroundColor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" gutterBottom align="center">
            Our Services
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom align="center" sx={{ mb: 6 }}>
            Everything you need for a perfect trip
          </Typography>
          
          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ 
                  height: '100%', 
                  textAlign: 'center',
                  p: 3,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  }
                }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {service.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
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
      </Box>
    </Box>
  );
};

export default Home; 