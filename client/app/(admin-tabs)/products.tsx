import { View, Text, ScrollView, TextInput, Pressable, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import { getProducts, deleteProduct, type Product } from '@/utils/api';
import ProductCard from '@/components/product-card';
import ProductFormModal from '@/components/product-form-modal';

const CATEGORIES = ['All', 'Mysore Silks', 'Lucknowi Threads', 'Manish Collections'];

export default function AdminProductsScreen() {
  const { token } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const loadProducts = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getProducts(token, {
        category: selectedCategory === 'All' ? undefined : selectedCategory,
      });
      if (response.success) {
        setProducts(response.products);
        setFilteredProducts(response.products);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      Alert.alert('Error', 'Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [token, selectedCategory]);

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [loadProducts])
  );

  useEffect(() => {
    // Filter products by search query
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = products.filter(
        (product) =>
          product.productName.toLowerCase().includes(query) ||
          product.modelNumber.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setModalVisible(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setModalVisible(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    console.log('handleDeleteProduct called with productId:', productId);
    console.log('Current token:', token ? 'Token exists' : 'No token');
    
    if (!token) {
      Alert.alert('Error', 'Authentication required. Please login again.');
      return;
    }

    const performDelete = async () => {
      console.log('Delete confirmed, calling API...');
      try {
        setLoading(true);
        console.log('Calling deleteProduct API with:', { productId, token: token ? 'exists' : 'missing' });
        const response = await deleteProduct(productId, token);
        console.log('Delete API response:', response);
        
        if (response && response.success) {
          console.log('Product deleted successfully');
          Alert.alert('Success', 'Product deleted successfully!');
          await loadProducts();
        } else {
          console.error('Delete failed:', response);
          Alert.alert('Error', response?.message || 'Failed to delete product.');
        }
      } catch (error) {
        console.error('Delete product error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete product. Please try again.';
        Alert.alert('Error', errorMessage);
      } finally {
        setLoading(false);
      }
    };

    // Use window.confirm for web platform, Alert.alert for native
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.confirm) {
      const confirmed = window.confirm('Are you sure you want to delete this product? This action cannot be undone.');
      if (confirmed) {
        await performDelete();
      } else {
        console.log('Delete cancelled by user');
      }
    } else {
      Alert.alert(
        'Delete Product',
        'Are you sure you want to delete this product? This action cannot be undone.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {
              console.log('Delete cancelled by user');
            },
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: performDelete,
          },
        ],
        { cancelable: true }
      );
    }
  };

  const handleModalSuccess = () => {
    loadProducts();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1a1f3a]">
      {/* Header */}
      <View className="px-6 pt-6 pb-4 flex-row items-center justify-between">
        <Text className="text-white text-2xl font-bold">Products</Text>
        <Pressable
          onPress={handleAddProduct}
          className="bg-[#22c55e] rounded-xl px-4 py-2 flex-row items-center">
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text className="text-white font-semibold ml-2">Add</Text>
        </Pressable>
      </View>

      {/* Search Bar */}
      <View className="px-6 mb-4">
        <View className="bg-[#2d324a] rounded-xl px-4 py-3 flex-row items-center">
          <Ionicons name="search-outline" size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 text-white ml-2 text-base"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search products..."
            placeholderTextColor="#6b7280"
          />
        </View>
      </View>

      {/* Category Filters */}
      <View className="px-6 mb-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {CATEGORIES.map((category) => (
            <Pressable
              key={category}
              onPress={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full mr-2 ${
                selectedCategory === category
                  ? 'bg-[#22c55e]'
                  : 'bg-[#2d324a]'
              }`}>
              <Text
                className={`text-sm font-semibold ${
                  selectedCategory === category ? 'text-white' : 'text-gray-400'
                }`}>
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Products List */}
      <ScrollView 
        className="flex-1 px-6" 
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled">
        {loading ? (
          <View className="py-8">
            <ActivityIndicator size="large" color="#22c55e" />
          </View>
        ) : filteredProducts.length === 0 ? (
          <View className="py-8 items-center">
            <Ionicons name="cube-outline" size={64} color="#6b7280" />
            <Text className="text-gray-400 text-base mt-4">
              {searchQuery ? 'No products found matching your search' : 'No products found'}
            </Text>
          </View>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))
        )}
      </ScrollView>

      {/* Product Form Modal */}
      <ProductFormModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingProduct(null);
        }}
        onSuccess={handleModalSuccess}
        product={editingProduct}
      />
    </SafeAreaView>
  );
}
