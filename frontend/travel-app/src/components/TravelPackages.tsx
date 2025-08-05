import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Rating,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { RootState, AppDispatch } from '../store/store';
import { fetchTravelPackages, setFilters, clearFilters } from '../store/slices/travelSlice';
import { categories, TravelPackage } from '../data/travelPackages';

const TravelPackages: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { packages, loading, error, filters } = useSelector((state: RootState) => state.travel);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchTravelPackages());
  }, [dispatch]);

  const handleFilterChange = (field: string, value: any) => {
    dispatch(setFilters({ [field]: value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchTerm('');
  };

  const filteredPackages = packages.filter((pkg: TravelPackage) => {
    const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDestination = !filters.destination || pkg.destination === filters.destination;
    const matchesPrice = pkg.price >= filters.minPrice && pkg.price <= filters.maxPrice;
    const matchesDuration = !filters.duration || pkg.durationDays === filters.duration;
    const matchesCategory = !filters.category || pkg.category === filters.category;

    return matchesSearch && matchesDestination && matchesPrice && matchesDuration && matchesCategory;
  });

  const destinations = ['Bali, Indonesia', 'Swiss Alps', 'Paris, France', 'Serengeti, Tanzania', 'Greek Islands', 'Kyoto, Japan', 'Mediterranean Sea', 'Multiple European Cities', 'Maldives', 'Whistler, Canada'];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Travel Packages
      </Typography>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Search packages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Destination</InputLabel>
              <Select
                value={filters.destination}
                label="Destination"
                onChange={(e) => handleFilterChange('destination', e.target.value)}
              >
                <MenuItem value="">All Destinations</MenuItem>
                {destinations.map((dest) => (
                  <MenuItem key={dest} value={dest}>{dest}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                label="Category"
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>

        <Box mt={2}>
          <Typography gutterBottom>Price Range</Typography>
          <Slider
            value={[filters.minPrice, filters.maxPrice]}
            onChange={(_, value) => {
              if (Array.isArray(value)) {
                handleFilterChange('minPrice', value[0]);
                handleFilterChange('maxPrice', value[1]);
              }
            }}
            valueLabelDisplay="auto"
            min={0}
            max={5000}
            step={100}
          />
        </Box>
      </Paper>

      {/* Packages Grid */}
      <Grid container spacing={3}>
        {filteredPackages.map((pkg: TravelPackage) => (
          <Grid item xs={12} sm={6} md={4} key={pkg.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={pkg.imageUrl}
                alt={pkg.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {pkg.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {pkg.description}
                </Typography>
                
                <Box display="flex" alignItems="center" mb={1}>
                  <Rating value={pkg.rating} readOnly size="small" />
                  <Typography variant="body2" ml={1}>
                    ({pkg.reviews} reviews)
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" color="primary">
                    ${pkg.price}
                  </Typography>
                  <Chip label={pkg.category} size="small" color="secondary" />
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body2">
                    📍 {pkg.destination}
                  </Typography>
                  <Typography variant="body2">
                    ⏱️ {pkg.durationDays} days
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Max {pkg.maxTravelers} travelers
                  </Typography>
                  <Button variant="contained" color="primary" size="small">
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredPackages.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No packages found matching your criteria
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TravelPackages; 