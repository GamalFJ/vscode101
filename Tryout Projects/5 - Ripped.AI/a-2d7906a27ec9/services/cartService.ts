import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../data/gearSupplements';

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: Date;
}

const CART_STORAGE_KEY = 'gear_supplements_cart';
const WISHLIST_STORAGE_KEY = 'gear_supplements_wishlist';

export class CartService {
  
  // Get cart items
  static async getCartItems(): Promise<CartItem[]> {
    try {
      const cartData = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (cartData) {
        const items = JSON.parse(cartData);
        return items.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting cart items:', error);
      return [];
    }
  }

  // Add item to cart
  static async addToCart(product: Product, quantity: number = 1): Promise<boolean> {
    try {
      const cartItems = await this.getCartItems();
      const existingItemIndex = cartItems.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        cartItems[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        cartItems.push({
          product,
          quantity,
          addedAt: new Date()
        });
      }
      
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      console.log(`Added ${product.name} to cart (quantity: ${quantity})`);
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  }

  // Remove item from cart
  static async removeFromCart(productId: string): Promise<boolean> {
    try {
      const cartItems = await this.getCartItems();
      const filteredItems = cartItems.filter(item => item.product.id !== productId);
      
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(filteredItems));
      console.log(`Removed product ${productId} from cart`);
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  }

  // Update item quantity
  static async updateQuantity(productId: string, quantity: number): Promise<boolean> {
    try {
      const cartItems = await this.getCartItems();
      const itemIndex = cartItems.findIndex(item => item.product.id === productId);
      
      if (itemIndex >= 0) {
        if (quantity <= 0) {
          return this.removeFromCart(productId);
        } else {
          cartItems[itemIndex].quantity = quantity;
          await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
          console.log(`Updated quantity for product ${productId} to ${quantity}`);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error updating quantity:', error);
      return false;
    }
  }

  // Clear cart
  static async clearCart(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
      console.log('Cart cleared');
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  }

  // Get cart total
  static async getCartTotal(): Promise<number> {
    try {
      const cartItems = await this.getCartItems();
      return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    } catch (error) {
      console.error('Error calculating cart total:', error);
      return 0;
    }
  }

  // Get cart item count
  static async getCartItemCount(): Promise<number> {
    try {
      const cartItems = await this.getCartItems();
      return cartItems.reduce((count, item) => count + item.quantity, 0);
    } catch (error) {
      console.error('Error getting cart item count:', error);
      return 0;
    }
  }

  // Wishlist methods
  static async getWishlistItems(): Promise<Product[]> {
    try {
      const wishlistData = await AsyncStorage.getItem(WISHLIST_STORAGE_KEY);
      return wishlistData ? JSON.parse(wishlistData) : [];
    } catch (error) {
      console.error('Error getting wishlist items:', error);
      return [];
    }
  }

  static async addToWishlist(product: Product): Promise<boolean> {
    try {
      const wishlistItems = await this.getWishlistItems();
      const exists = wishlistItems.some(item => item.id === product.id);
      
      if (!exists) {
        wishlistItems.push(product);
        await AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
        console.log(`Added ${product.name} to wishlist`);
      }
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }
  }

  static async removeFromWishlist(productId: string): Promise<boolean> {
    try {
      const wishlistItems = await this.getWishlistItems();
      const filteredItems = wishlistItems.filter(item => item.id !== productId);
      
      await AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(filteredItems));
      console.log(`Removed product ${productId} from wishlist`);
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }
  }

  static async isInWishlist(productId: string): Promise<boolean> {
    try {
      const wishlistItems = await this.getWishlistItems();
      return wishlistItems.some(item => item.id === productId);
    } catch (error) {
      console.error('Error checking wishlist:', error);
      return false;
    }
  }
}

export default CartService;