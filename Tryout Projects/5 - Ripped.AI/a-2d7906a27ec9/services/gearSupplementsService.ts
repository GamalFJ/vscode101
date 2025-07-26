import { Product, gearSupplementsData } from '../data/gearSupplements';

// Simulate API delay
const simulateApiDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Mock API service for gear and supplements
export class GearSupplementsService {
  
  // Fetch all products
  static async getAllProducts(): Promise<Product[]> {
    await simulateApiDelay();
    console.log('API: Fetching all products');
    return gearSupplementsData;
  }

  // Fetch products by category
  static async getProductsByCategory(category: string): Promise<Product[]> {
    await simulateApiDelay();
    console.log(`API: Fetching products for category: ${category}`);
    return gearSupplementsData.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Search products
  static async searchProducts(query: string): Promise<Product[]> {
    await simulateApiDelay();
    console.log(`API: Searching products with query: ${query}`);
    const lowercaseQuery = query.toLowerCase();
    return gearSupplementsData.filter(product => 
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.brand.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery) ||
      product.features.some(feature => feature.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Get product by ID
  static async getProductById(id: string): Promise<Product | null> {
    await simulateApiDelay();
    console.log(`API: Fetching product with ID: ${id}`);
    return gearSupplementsData.find(product => product.id === id) || null;
  }

  // Get featured products (high rating)
  static async getFeaturedProducts(): Promise<Product[]> {
    await simulateApiDelay();
    console.log('API: Fetching featured products');
    return gearSupplementsData.filter(product => product.rating >= 4.5);
  }

  // Get products by price range
  static async getProductsByPriceRange(min: number, max: number): Promise<Product[]> {
    await simulateApiDelay();
    console.log(`API: Fetching products in price range: $${min} - $${max}`);
    return gearSupplementsData.filter(product => 
      product.price >= min && product.price <= max
    );
  }

  // Get products by brand
  static async getProductsByBrand(brand: string): Promise<Product[]> {
    await simulateApiDelay();
    console.log(`API: Fetching products for brand: ${brand}`);
    return gearSupplementsData.filter(product => 
      product.brand.toLowerCase().includes(brand.toLowerCase())
    );
  }

  // Get in-stock products only
  static async getInStockProducts(): Promise<Product[]> {
    await simulateApiDelay();
    console.log('API: Fetching in-stock products');
    return gearSupplementsData.filter(product => product.inStock);
  }

  // Get product recommendations based on category
  static async getRecommendedProducts(category: string, excludeId?: string): Promise<Product[]> {
    await simulateApiDelay();
    console.log(`API: Fetching recommended products for category: ${category}`);
    let products = gearSupplementsData.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
    
    if (excludeId) {
      products = products.filter(product => product.id !== excludeId);
    }
    
    // Sort by rating and return top 4
    return products
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
  }

  // Get categories with product counts
  static async getCategoriesWithCounts(): Promise<{ category: string; count: number; icon: string }[]> {
    await simulateApiDelay();
    console.log('API: Fetching categories with counts');
    
    const categories = ['Apparel', 'Equipment', 'Supplements', 'Drinks'];
    const categoriesWithCounts = categories.map(category => {
      const count = gearSupplementsData.filter(product => 
        product.category === category
      ).length;
      
      let icon = 'cube-outline';
      switch (category) {
        case 'Apparel':
          icon = 'shirt-outline';
          break;
        case 'Equipment':
          icon = 'barbell-outline';
          break;
        case 'Supplements':
          icon = 'medical-outline';
          break;
        case 'Drinks':
          icon = 'water-outline';
          break;
      }
      
      return { category, count, icon };
    });
    
    return categoriesWithCounts;
  }

  // Simulate adding product to cart
  static async addToCart(productId: string, quantity: number = 1): Promise<boolean> {
    await simulateApiDelay(300);
    console.log(`API: Adding product ${productId} to cart (quantity: ${quantity})`);
    // In a real app, this would make an API call to add the item to the user's cart
    // For now, we'll use local storage through CartService
    const product = gearSupplementsData.find(p => p.id === productId);
    if (product) {
      const { CartService } = await import('./cartService');
      return CartService.addToCart(product, quantity);
    }
    return false;
  }

  // Simulate adding product to wishlist
  static async addToWishlist(productId: string): Promise<boolean> {
    await simulateApiDelay(300);
    console.log(`API: Adding product ${productId} to wishlist`);
    // In a real app, this would make an API call to add the item to the user's wishlist
    // For now, we'll use local storage through CartService
    const product = gearSupplementsData.find(p => p.id === productId);
    if (product) {
      const { CartService } = await import('./cartService');
      return CartService.addToWishlist(product);
    }
    return false;
  }

  // Get trending products (simulate based on reviews count)
  static async getTrendingProducts(): Promise<Product[]> {
    await simulateApiDelay();
    console.log('API: Fetching trending products');
    return gearSupplementsData
      .sort((a, b) => b.reviews - a.reviews)
      .slice(0, 6);
  }
}

export default GearSupplementsService;