export interface TravelPackage {
  id: string;
  title: string;
  description: string;
  destination: string;
  price: number;
  durationDays: number;
  maxTravelers: number;
  isActive: boolean;
  imageUrl: string;
  category: string;
  rating: number;
  reviews: number;
}

export const travelPackages: TravelPackage[] = [
  {
    id: '1',
    title: 'Sunny Beach Paradise',
    description: 'Relaxing beach vacation with all-inclusive package',
    destination: 'Bali, Indonesia',
    price: 1299.99,
    durationDays: 7,
    maxTravelers: 4,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop',
    category: 'Beach',
    rating: 4.8,
    reviews: 156
  },
  {
    id: '2',
    title: 'Mountain Adventure',
    description: 'Hiking and outdoor activities in the Alps',
    destination: 'Swiss Alps',
    price: 899.99,
    durationDays: 5,
    maxTravelers: 6,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    category: 'Adventure',
    rating: 4.6,
    reviews: 89
  },
  {
    id: '3',
    title: 'City Break in Paris',
    description: 'Romantic getaway in the City of Light',
    destination: 'Paris, France',
    price: 799.99,
    durationDays: 4,
    maxTravelers: 2,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&h=600&fit=crop',
    category: 'City',
    rating: 4.9,
    reviews: 234
  },
  {
    id: '4',
    title: 'Safari Experience',
    description: 'Wildlife safari in African savanna',
    destination: 'Serengeti, Tanzania',
    price: 2499.99,
    durationDays: 10,
    maxTravelers: 8,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&h=600&fit=crop',
    category: 'Adventure',
    rating: 4.7,
    reviews: 67
  },
  {
    id: '5',
    title: 'Island Hopping',
    description: 'Explore multiple Greek islands',
    destination: 'Greek Islands',
    price: 1599.99,
    durationDays: 8,
    maxTravelers: 6,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop',
    category: 'Beach',
    rating: 4.5,
    reviews: 123
  },
  {
    id: '6',
    title: 'Cultural Tour',
    description: 'Historical sites and local culture',
    destination: 'Kyoto, Japan',
    price: 1199.99,
    durationDays: 6,
    maxTravelers: 4,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=600&fit=crop',
    category: 'Cultural',
    rating: 4.8,
    reviews: 98
  },
  {
    id: '7',
    title: 'Luxury Cruise',
    description: 'Premium cruise experience',
    destination: 'Mediterranean Sea',
    price: 3499.99,
    durationDays: 12,
    maxTravelers: 10,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
    category: 'Luxury',
    rating: 4.9,
    reviews: 45
  },
  {
    id: '8',
    title: 'Backpacking Europe',
    description: 'Budget-friendly European tour',
    destination: 'Multiple European Cities',
    price: 699.99,
    durationDays: 14,
    maxTravelers: 12,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
    category: 'Budget',
    rating: 4.3,
    reviews: 178
  },
  {
    id: '9',
    title: 'Tropical Paradise',
    description: 'Exotic beach destination',
    destination: 'Maldives',
    price: 1899.99,
    durationDays: 9,
    maxTravelers: 4,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=600&fit=crop',
    category: 'Luxury',
    rating: 4.9,
    reviews: 89
  },
  {
    id: '10',
    title: 'Winter Sports',
    description: 'Skiing and snowboarding adventure',
    destination: 'Whistler, Canada',
    price: 1499.99,
    durationDays: 7,
    maxTravelers: 6,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1551524164-4876eb6e32a8?w=800&h=600&fit=crop',
    category: 'Adventure',
    rating: 4.6,
    reviews: 112
  }
];

export const categories = [
  'All',
  'Beach',
  'Adventure',
  'City',
  'Cultural',
  'Luxury',
  'Budget'
]; 