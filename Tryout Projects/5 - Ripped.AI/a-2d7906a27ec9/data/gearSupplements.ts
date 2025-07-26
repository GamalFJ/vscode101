export interface Product {
  id: string;
  name: string;
  category: 'Apparel' | 'Equipment' | 'Supplements' | 'Drinks';
  price: number;
  image: string;
  description: string;
  brand: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  features: string[];
  link: string;
}

export const gearSupplementsData: Product[] = [
  // Apparel
  {
    id: 'app1',
    name: 'Performance Training Tank',
    category: 'Apparel',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    description: 'Moisture-wicking tank top designed for intense workouts',
    brand: 'FitGear Pro',
    rating: 4.5,
    reviews: 234,
    inStock: true,
    features: ['Moisture-wicking fabric', 'Anti-odor technology', 'Lightweight design'],
    link: 'https://example.com/training-tank'
  },
  {
    id: 'app2',
    name: 'Compression Leggings',
    category: 'Apparel',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1506629905607-c28b47e8b6e1?w=400&h=400&fit=crop',
    description: 'High-performance compression leggings for maximum support',
    brand: 'FlexFit',
    rating: 4.7,
    reviews: 189,
    inStock: true,
    features: ['4-way stretch', 'Compression support', 'High waistband'],
    link: 'https://example.com/compression-leggings'
  },
  {
    id: 'app3',
    name: 'Athletic Running Shoes',
    category: 'Apparel',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    description: 'Lightweight running shoes with superior cushioning',
    brand: 'RunMax',
    rating: 4.6,
    reviews: 456,
    inStock: true,
    features: ['Breathable mesh upper', 'Responsive cushioning', 'Durable outsole'],
    link: 'https://example.com/running-shoes'
  },
  {
    id: 'app4',
    name: 'Workout Gloves',
    category: 'Apparel',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    description: 'Padded workout gloves for better grip and protection',
    brand: 'GripMax',
    rating: 4.3,
    reviews: 167,
    inStock: true,
    features: ['Padded palms', 'Breathable fabric', 'Adjustable wrist strap'],
    link: 'https://example.com/workout-gloves'
  },

  // Equipment
  {
    id: 'eq1',
    name: 'Adjustable Dumbbells Set',
    category: 'Equipment',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    description: 'Space-saving adjustable dumbbells for home workouts',
    brand: 'HomeFit',
    rating: 4.8,
    reviews: 312,
    inStock: true,
    features: ['5-50 lbs per dumbbell', 'Quick weight adjustment', 'Compact design'],
    link: 'https://example.com/adjustable-dumbbells'
  },
  {
    id: 'eq2',
    name: 'Resistance Bands Set',
    category: 'Equipment',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    description: 'Complete resistance bands set with multiple resistance levels',
    brand: 'FlexBand',
    rating: 4.4,
    reviews: 278,
    inStock: true,
    features: ['5 resistance levels', 'Door anchor included', 'Portable design'],
    link: 'https://example.com/resistance-bands'
  },
  {
    id: 'eq3',
    name: 'Yoga Mat Premium',
    category: 'Equipment',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop',
    description: 'Extra thick yoga mat with superior grip and cushioning',
    brand: 'ZenMat',
    rating: 4.6,
    reviews: 445,
    inStock: true,
    features: ['6mm thickness', 'Non-slip surface', 'Eco-friendly material'],
    link: 'https://example.com/yoga-mat'
  },
  {
    id: 'eq4',
    name: 'Foam Roller',
    category: 'Equipment',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    description: 'High-density foam roller for muscle recovery and massage',
    brand: 'RecoverPro',
    rating: 4.5,
    reviews: 203,
    inStock: true,
    features: ['High-density foam', 'Textured surface', 'Lightweight'],
    link: 'https://example.com/foam-roller'
  },

  // Supplements
  {
    id: 'sup1',
    name: 'Whey Protein Powder',
    category: 'Supplements',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop',
    description: 'Premium whey protein for muscle building and recovery',
    brand: 'MuscleFuel',
    rating: 4.7,
    reviews: 567,
    inStock: true,
    features: ['25g protein per serving', 'Fast absorption', 'Great taste'],
    link: 'https://example.com/whey-protein'
  },
  {
    id: 'sup2',
    name: 'Creatine Monohydrate',
    category: 'Supplements',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop',
    description: 'Pure creatine monohydrate for strength and power',
    brand: 'PowerMax',
    rating: 4.6,
    reviews: 389,
    inStock: true,
    features: ['Pure creatine', 'Unflavored', '60 servings'],
    link: 'https://example.com/creatine'
  },
  {
    id: 'sup3',
    name: 'Pre-Workout Energy',
    category: 'Supplements',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop',
    description: 'High-energy pre-workout formula for intense training',
    brand: 'EnergyBoost',
    rating: 4.4,
    reviews: 234,
    inStock: true,
    features: ['200mg caffeine', 'Beta-alanine', 'Citrulline malate'],
    link: 'https://example.com/pre-workout'
  },
  {
    id: 'sup4',
    name: 'Multivitamin Complex',
    category: 'Supplements',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop',
    description: 'Complete multivitamin for overall health and wellness',
    brand: 'VitalHealth',
    rating: 4.5,
    reviews: 445,
    inStock: true,
    features: ['24 vitamins & minerals', 'Daily support', 'Easy to swallow'],
    link: 'https://example.com/multivitamin'
  },

  // Drinks
  {
    id: 'dr1',
    name: 'Electrolyte Sports Drink',
    category: 'Drinks',
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop',
    description: 'Hydrating sports drink with essential electrolytes',
    brand: 'HydroMax',
    rating: 4.3,
    reviews: 156,
    inStock: true,
    features: ['Zero sugar', 'Essential electrolytes', 'Natural flavors'],
    link: 'https://example.com/sports-drink'
  },
  {
    id: 'dr2',
    name: 'Protein Shake Ready-to-Drink',
    category: 'Drinks',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop',
    description: 'Convenient ready-to-drink protein shake',
    brand: 'QuickProtein',
    rating: 4.2,
    reviews: 89,
    inStock: true,
    features: ['20g protein', 'Ready to drink', 'Great taste'],
    link: 'https://example.com/protein-shake'
  },
  {
    id: 'dr3',
    name: 'Energy Drink Natural',
    category: 'Drinks',
    price: 3.49,
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop',
    description: 'Natural energy drink with organic ingredients',
    brand: 'NaturalBoost',
    rating: 4.1,
    reviews: 123,
    inStock: true,
    features: ['Natural caffeine', 'Organic ingredients', 'No artificial colors'],
    link: 'https://example.com/energy-drink'
  },
  {
    id: 'dr4',
    name: 'Recovery Drink Mix',
    category: 'Drinks',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop',
    description: 'Post-workout recovery drink mix with BCAAs',
    brand: 'RecoverFast',
    rating: 4.4,
    reviews: 267,
    inStock: true,
    features: ['BCAAs included', '30 servings', 'Fast recovery'],
    link: 'https://example.com/recovery-drink'
  }
];

export const getProductsByCategory = (category: string): Product[] => {
  return gearSupplementsData.filter(product => 
    product.category.toLowerCase() === category.toLowerCase()
  );
};

export const getProductById = (id: string): Product | undefined => {
  return gearSupplementsData.find(product => product.id === id);
};

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return gearSupplementsData.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.brand.toLowerCase().includes(lowercaseQuery) ||
    product.category.toLowerCase().includes(lowercaseQuery)
  );
};

export const getFeaturedProducts = (): Product[] => {
  return gearSupplementsData.filter(product => product.rating >= 4.5);
};

export const getProductsByPriceRange = (min: number, max: number): Product[] => {
  return gearSupplementsData.filter(product => 
    product.price >= min && product.price <= max
  );
};