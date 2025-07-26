import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useTheme } from '../../utils/theme.tsx';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../../components/ProductCard';
import { Product } from '../../data/gearSupplements';
import GearSupplementsService from '../../services/gearSupplementsService';

const { width } = Dimensions.get('window');

const GearSupplementsScreen: React.FC = () => {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [categoriesWithCounts, setCategoriesWithCounts] = useState<{ category: string; count: number; icon: string }[]>([]);

  const categories = ['All', 'Apparel', 'Equipment', 'Supplements', 'Drinks'];

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      console.log('Loading initial data for Gear & Supplements...');
      
      const [products, categoryCounts] = await Promise.all([
        GearSupplementsService.getAllProducts(),
        GearSupplementsService.getCategoriesWithCounts(),
      ]);
      
      setAllProducts(products);
      setFilteredProducts(products);
      setCategoriesWithCounts(categoryCounts);
      console.log(`Loaded ${products.length} products`);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const handleCategorySelect = async (category: string) => {
    try {
      setSelectedCategory(category);
      setSearchQuery('');
      setLoading(true);
      
      if (category === 'All') {
        const products = await GearSupplementsService.getAllProducts();
        setFilteredProducts(products);
      } else {
        const products = await GearSupplementsService.getProductsByCategory(category);
        setFilteredProducts(products);
      }
    } catch (error) {
      console.error('Error filtering by category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    try {
      setSearchQuery(query);
      
      if (query.trim() === '') {
        if (selectedCategory === 'All') {
          const products = await GearSupplementsService.getAllProducts();
          setFilteredProducts(products);
        } else {
          const products = await GearSupplementsService.getProductsByCategory(selectedCategory);
          setFilteredProducts(products);
        }
      } else {
        const searchResults = await GearSupplementsService.searchProducts(query);
        if (selectedCategory !== 'All') {
          setFilteredProducts(
            searchResults.filter(product => product.category === selectedCategory)
          );
        } else {
          setFilteredProducts(searchResults);
        }
      }
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'All':
        return 'grid-outline';
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

  const renderProductCard = ({ item }: { item: Product }) => (
    <ProductCard product={item} />
  );

  const renderCategorySection = (category: string) => {
    const categoryProducts = allProducts.filter(product => product.category === category);
    const categoryInfo = categoriesWithCounts.find(cat => cat.category === category);
    
    return (
      <View key={category} style={styles.categorySection}>
        <View style={styles.categoryHeader}>
          <View style={styles.categoryTitleContainer}>
            <Ionicons 
              name={getCategoryIcon(category)} 
              size={24} 
              color={getCategoryColor(category)} 
            />
            <Text style={[styles.categoryTitle, { color: theme.colors.text }]}>
              {category}
            </Text>
            {categoryInfo && (
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{categoryInfo.count}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity 
            onPress={() => handleCategorySelect(category)}
            style={styles.viewAllButton}
          >
            <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
              View All
            </Text>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={categoryProducts.slice(0, 5)}
          renderItem={renderProductCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          snapToInterval={296}
          decelerationRate="fast"
        />
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 8,
      fontFamily: theme.fonts.bold,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: 20,
      fontFamily: theme.fonts.regular,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    searchIcon: {
      marginRight: 12,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text,
      fontFamily: theme.fonts.regular,
    },
    categoriesContainer: {
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    categoriesTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 12,
      fontFamily: theme.fonts.semiBold,
    },
    categoriesRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    categoryChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    categoryChipActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    categoryChipText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
      marginLeft: 6,
      fontFamily: theme.fonts.medium,
    },
    categoryChipTextActive: {
      color: '#fff',
    },
    content: {
      flex: 1,
    },
    categorySection: {
      marginBottom: 24,
    },
    categoryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 12,
    },
    categoryTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    categoryTitle: {
      fontSize: 20,
      fontWeight: '600',
      marginLeft: 8,
      fontFamily: theme.fonts.semiBold,
    },
    viewAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewAllText: {
      fontSize: 14,
      fontWeight: '500',
      marginRight: 4,
      fontFamily: theme.fonts.medium,
    },
    horizontalList: {
      paddingLeft: 20,
      paddingRight: 12,
    },
    filteredProductsContainer: {
      paddingHorizontal: 20,
    },
    filteredProductsTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 16,
      fontFamily: theme.fonts.semiBold,
    },
    productGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    productCardWrapper: {
      width: (width - 48) / 2,
      marginBottom: 16,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
    emptyStateIcon: {
      marginBottom: 16,
    },
    emptyStateTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 8,
      fontFamily: theme.fonts.semiBold,
    },
    emptyStateText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      paddingHorizontal: 40,
      fontFamily: theme.fonts.regular,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
    loadingText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginTop: 16,
      fontFamily: theme.fonts.medium,
    },
    countBadge: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 2,
      marginLeft: 8,
    },
    countText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#fff',
      fontFamily: theme.fonts.semiBold,
    },
  });

  const renderFilteredProducts = () => {
    if (filteredProducts.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons 
            name="search-outline" 
            size={64} 
            color={theme.colors.textSecondary}
            style={styles.emptyStateIcon}
          />
          <Text style={styles.emptyStateTitle}>No products found</Text>
          <Text style={styles.emptyStateText}>
            Try adjusting your search or browse different categories
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.filteredProductsContainer}>
        <Text style={styles.filteredProductsTitle}>
          {selectedCategory === 'All' ? 'All Products' : selectedCategory} 
          {searchQuery ? ` - "${searchQuery}"` : ''} ({filteredProducts.length})
        </Text>
        <FlatList
          data={filteredProducts}
          renderItem={renderProductCard}
          keyExtractor={(item) => item.id}
          numColumns={1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    );
  };

  const showCategorySections = selectedCategory === 'All' && searchQuery === '';

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Gear & Supplements</Text>
          <Text style={styles.subtitle}>
            Discover the best fitness gear, apparel, and supplements
          </Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gear & Supplements</Text>
        <Text style={styles.subtitle}>
          Discover the best fitness gear, apparel, and supplements
        </Text>
        
        <View style={styles.searchContainer}>
          <Ionicons 
            name="search-outline" 
            size={20} 
            color={theme.colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <Text style={styles.categoriesTitle}>Categories</Text>
        <View style={styles.categoriesRow}>
          {categories.map((category) => {
            const categoryInfo = categoriesWithCounts.find(cat => cat.category === category);
            const count = category === 'All' ? allProducts.length : (categoryInfo?.count || 0);
            
            return (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.categoryChipActive,
                ]}
                onPress={() => handleCategorySelect(category)}
              >
                <Ionicons
                  name={getCategoryIcon(category)}
                  size={16}
                  color={
                    selectedCategory === category 
                      ? '#fff' 
                      : getCategoryColor(category)
                  }
                />
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === category && styles.categoryChipTextActive,
                  ]}
                >
                  {category} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {showCategorySections ? (
          <>
            {['Apparel', 'Equipment', 'Supplements', 'Drinks'].map(renderCategorySection)}
          </>
        ) : (
          renderFilteredProducts()
        )}
      </ScrollView>
    </View>
  );
};

export default GearSupplementsScreen;