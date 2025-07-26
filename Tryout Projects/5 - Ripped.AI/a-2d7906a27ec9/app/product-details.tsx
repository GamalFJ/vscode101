import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../utils/theme.tsx';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Product } from '../data/gearSupplements';
import GearSupplementsService from '../services/gearSupplementsService';
import { CartService } from '../services/cartService';
import ProductCard from '../components/ProductCard';

const { width } = Dimensions.get('window');

const ProductDetailsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);

  const loadProductDetails = useCallback(async () => {
    try {
      setLoading(true);
      console.log(`Loading product details for ID: ${productId}`);
      
      const productData = await GearSupplementsService.getProductById(productId);
      if (productData) {
        setProduct(productData);
        
        // Check if product is in wishlist
        const inWishlist = await CartService.isInWishlist(productData.id);
        setIsWishlisted(inWishlist);
        
        // Load recommended products
        const recommended = await GearSupplementsService.getRecommendedProducts(
          productData.category,
          productData.id
        );
        setRecommendedProducts(recommended);
      }
    } catch (error) {
      console.error('Error loading product details:', error);
      Alert.alert('Error', 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) {
      loadProductDetails();
    }
  }, [productId]);

  const handleBuyNow = async () => {
    if (!product) return;
    
    try {
      const supported = await Linking.canOpenURL(product.link);
      if (supported) {
        await Linking.openURL(product.link);
      } else {
        Alert.alert('Error', 'Unable to open product link');
      }
    } catch (error) {
      console.log('Error opening link:', error);
      Alert.alert('Error', 'Unable to open product link');
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      const success = await GearSupplementsService.addToCart(product.id);
      if (success) {
        Alert.alert('Success', `${product.name} added to cart!`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add product to cart');
    }
  };

  const handleToggleWishlist = async () => {
    if (!product) return;
    
    try {
      if (!isWishlisted) {
        const success = await CartService.addToWishlist(product);
        if (success) {
          setIsWishlisted(true);
          Alert.alert('Success', `${product.name} added to wishlist!`);
        }
      } else {
        const success = await CartService.removeFromWishlist(product.id);
        if (success) {
          setIsWishlisted(false);
          Alert.alert('Success', `${product.name} removed from wishlist!`);
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      Alert.alert('Error', 'Failed to update wishlist');
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Apparel':
        return '#FF6B6B';
      case 'Equipment':
        return '#4ECDC4';
      case 'Supplements':
        return '#45B7D1';
      case 'Drinks':
        return '#96CEB4';
      default:
        return theme.colors.primary;
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={16} color="#FFD700" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={16} color="#FFD700" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#FFD700" />
      );
    }

    return stars;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 20,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      marginRight: 16,
    },
    headerTitle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      fontFamily: theme.fonts.semiBold,
    },
    wishlistButton: {
      padding: 8,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginTop: 16,
      fontFamily: theme.fonts.medium,
    },
    content: {
      flex: 1,
    },
    imageContainer: {
      position: 'relative',
      backgroundColor: theme.colors.surface,
    },
    productImage: {
      width: width,
      height: 300,
      backgroundColor: theme.colors.background,
    },
    categoryBadge: {
      position: 'absolute',
      top: 20,
      right: 20,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    categoryText: {
      fontSize: 12,
      fontWeight: '600',
      marginLeft: 6,
      color: '#333',
      fontFamily: theme.fonts.semiBold,
    },
    stockBadge: {
      position: 'absolute',
      top: 20,
      left: 20,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: 'rgba(76, 175, 80, 0.9)',
    },
    stockText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#fff',
      fontFamily: theme.fonts.semiBold,
    },
    outOfStockBadge: {
      backgroundColor: 'rgba(244, 67, 54, 0.9)',
    },
    productInfo: {
      padding: 20,
    },
    productName: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 8,
      fontFamily: theme.fonts.bold,
    },
    brandName: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: 12,
      fontFamily: theme.fonts.medium,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    ratingText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginLeft: 8,
      fontFamily: theme.fonts.medium,
    },
    priceContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    price: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.colors.primary,
      fontFamily: theme.fonts.bold,
    },
    description: {
      fontSize: 16,
      color: theme.colors.text,
      lineHeight: 24,
      marginBottom: 20,
      fontFamily: theme.fonts.regular,
    },
    featuresContainer: {
      marginBottom: 24,
    },
    featuresTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 12,
      fontFamily: theme.fonts.semiBold,
    },
    feature: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 6,
      fontFamily: theme.fonts.regular,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 12,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    addToCartButton: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      paddingVertical: 16,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    addToCartText: {
      color: theme.colors.primary,
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
      fontFamily: theme.fonts.semiBold,
    },
    buyNowButton: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      paddingVertical: 16,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buyNowText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
      fontFamily: theme.fonts.semiBold,
    },
    recommendedSection: {
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    recommendedTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 16,
      paddingHorizontal: 20,
      fontFamily: theme.fonts.semiBold,
    },
    recommendedList: {
      paddingLeft: 20,
      paddingBottom: 20,
    },
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Details</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading product details...</Text>
        </View>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Not Found</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={theme.colors.textSecondary} />
          <Text style={styles.loadingText}>Product not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{product.name}</Text>
        <TouchableOpacity style={styles.wishlistButton} onPress={handleToggleWishlist}>
          <Ionicons 
            name={isWishlisted ? "heart" : "heart-outline"} 
            size={24} 
            color={isWishlisted ? "#FF6B6B" : theme.colors.text} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: product.image }} 
            style={styles.productImage}
            resizeMode="cover"
          />
          <View style={styles.categoryBadge}>
            <Ionicons 
              name="cube-outline" 
              size={14} 
              color={getCategoryColor(product.category)} 
            />
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>
          <View style={[styles.stockBadge, !product.inStock && styles.outOfStockBadge]}>
            <Text style={styles.stockText}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.brandName}>{product.brand}</Text>

          <View style={styles.ratingContainer}>
            {renderStars(product.rating)}
            <Text style={styles.ratingText}>
              {product.rating} ({product.reviews} reviews)
            </Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>${product.price}</Text>
          </View>

          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>Features</Text>
            {product.features.map((feature, index) => (
              <Text key={index} style={styles.feature}>
                • {feature}
              </Text>
            ))}
          </View>
        </View>

        {recommendedProducts.length > 0 && (
          <View style={styles.recommendedSection}>
            <Text style={styles.recommendedTitle}>You might also like</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recommendedList}
            >
              {recommendedProducts.map((item) => (
                <ProductCard 
                  key={item.id} 
                  product={item} 
                  onPress={() => router.push(`/product-details?productId=${item.id}`)}
                />
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Ionicons name="cart-outline" size={20} color={theme.colors.primary} />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
          <Ionicons name="open-outline" size={20} color="#fff" />
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetailsScreen;