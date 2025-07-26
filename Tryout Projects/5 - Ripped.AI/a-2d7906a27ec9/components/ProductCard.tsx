import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  FadeInDown
} from 'react-native-reanimated';
import { useTheme } from '../utils/theme.tsx';
import { Product } from '../data/gearSupplements';
import { router } from 'expo-router';
import { commonStyles, spacing, borderRadius } from '../styles/commonStyles';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  index?: number;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, index = 0 }) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const handleLinkPress = async () => {
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Apparel':
        return 'shirt-outline';
      case 'Equipment':
        return 'barbell-outline';
      case 'Supplements':
        return 'medical-outline';
      case 'Drinks':
        return 'water-outline';
      default:
        return 'cube-outline';
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
        <Ionicons key={i} name="star" size={12} color="#FFD700" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={12} color="#FFD700" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={12} color="#FFD700" />
      );
    }

    return stars;
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const styles = {
    card: {
      ...commonStyles.card,
      width: 280,
      marginHorizontal: spacing.sm,
      marginVertical: spacing.sm,
      padding: spacing.lg,
    },
    imageContainer: {
      position: 'relative' as const,
      marginBottom: spacing.md,
    },
    productImage: {
      width: '100%',
      height: 160,
      borderRadius: borderRadius.md,
      backgroundColor: theme.colors.background,
    },
    categoryBadge: {
      position: 'absolute' as const,
      top: spacing.sm,
      right: spacing.sm,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.lg,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      ...commonStyles.shadowSM,
    },
    categoryText: {
      fontSize: 10,
      fontWeight: '600' as const,
      marginLeft: 4,
      color: '#333',
      fontFamily: theme.fonts.semiBold,
    },
    stockBadge: {
      position: 'absolute' as const,
      top: spacing.sm,
      left: spacing.sm,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.lg,
      backgroundColor: theme.colors.success,
      ...commonStyles.shadowSM,
    },
    stockText: {
      fontSize: 10,
      fontWeight: '600' as const,
      color: theme.colors.white,
      fontFamily: theme.fonts.semiBold,
    },
    outOfStockBadge: {
      backgroundColor: theme.colors.error,
    },
    productInfo: {
      flex: 1,
    },
    productName: {
      ...commonStyles.subheading,
      marginBottom: spacing.xs,
    },
    brandName: {
      ...commonStyles.caption,
      marginBottom: spacing.sm,
      fontWeight: '600' as const,
    },
    description: {
      ...commonStyles.bodySecondary,
      marginBottom: spacing.sm,
      lineHeight: 18,
    },
    ratingContainer: {
      ...commonStyles.row,
      marginBottom: spacing.sm,
    },
    ratingText: {
      ...commonStyles.caption,
      marginLeft: spacing.sm,
    },
    priceContainer: {
      ...commonStyles.rowBetween,
      marginBottom: spacing.md,
    },
    price: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: theme.colors.primary,
      fontFamily: theme.fonts.bold,
    },
    featuresContainer: {
      marginBottom: spacing.md,
    },
    feature: {
      ...commonStyles.caption,
      marginBottom: 2,
    },
    buttonContainer: {
      flexDirection: 'row' as const,
      gap: spacing.sm,
    },
    linkButton: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      ...commonStyles.shadowSM,
    },
    linkButtonText: {
      color: theme.colors.background,
      fontSize: 14,
      fontWeight: '600' as const,
      marginLeft: spacing.xs,
      fontFamily: theme.fonts.semiBold,
    },
    viewButton: {
      backgroundColor: 'transparent',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
      borderWidth: 2,
      borderColor: theme.colors.primary,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    viewButtonText: {
      color: theme.colors.primary,
      fontSize: 14,
      fontWeight: '600' as const,
      marginLeft: spacing.xs,
      fontFamily: theme.fonts.semiBold,
    },
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(600)}
      style={animatedStyle}
    >
      <AnimatedTouchableOpacity
        style={styles.card}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: product.image }} 
            style={styles.productImage}
            resizeMode="cover"
          />
          <View style={styles.categoryBadge}>
            <Ionicons 
              name={getCategoryIcon(product.category)} 
              size={12} 
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
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={styles.brandName}>{product.brand}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {product.description}
          </Text>

          <View style={styles.ratingContainer}>
            {renderStars(product.rating)}
            <Text style={styles.ratingText}>
              {product.rating} ({product.reviews})
            </Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>${product.price}</Text>
          </View>

          <View style={styles.featuresContainer}>
            {product.features.slice(0, 2).map((feature, featureIndex) => (
              <Text key={featureIndex} style={styles.feature}>
                • {feature}
              </Text>
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.viewButton} 
              onPress={() => router.push(`/product-details?productId=${product.id}`)}
              activeOpacity={0.8}
            >
              <Ionicons name="eye-outline" size={16} color={theme.colors.primary} />
              <Text style={styles.viewButtonText}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.linkButton} 
              onPress={handleLinkPress}
              activeOpacity={0.8}
            >
              <Ionicons name="open-outline" size={16} color={theme.colors.background} />
              <Text style={styles.linkButtonText}>Buy Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </AnimatedTouchableOpacity>
    </Animated.View>
  );
};

export default ProductCard;