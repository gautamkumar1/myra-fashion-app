import { View, Text, ScrollView, TextInput, Pressable, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

interface StockByLocation {
  location: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  image: string;
  stockByLocation: StockByLocation[];
}

type FilterOption = 'Myra Fashion LLC' | 'Sameera Star Fashion LLC';

const mockProducts: Product[] = [
  {
    id: 'SAR-SLK-001',
    name: 'Banarasi Silk Saree',
    brand: 'Mysore Silks',
    price: 8999,
    stock: 65,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
    stockByLocation: [
      { location: 'Myra Fashion LLC', stock: 12 },
      { location: 'Sameera Star Fashion LLC', stock: 8 },
      { location: 'Main Warehouse', stock: 45 },
    ],
  },
  {
    id: 'KUR-COT-002',
    name: 'Cotton Chikankari Kurta',
    brand: 'Lucknowi Threads',
    price: 1499,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=400&fit=crop',
    stockByLocation: [
      { location: 'Myra Fashion LLC', stock: 10 },
      { location: 'Sameera Star Fashion LLC', stock: 15 },
      { location: 'Main Warehouse', stock: 0 },
    ],
  },
  {
    id: 'LHN-BRD-003',
    name: 'Bridal Lehenga Set',
    brand: 'Manish Collections',
    price: 45999,
    stock: 4,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    stockByLocation: [
      { location: 'Myra Fashion LLC', stock: 2 },
      { location: 'Sameera Star Fashion LLC', stock: 1 },
      { location: 'Main Warehouse', stock: 1 },
    ],
  },
  {
    id: 'SHW-PSH-004',
    name: 'Pashmina Shawl',
    brand: 'Kashmir Heritage',
    price: 12999,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop',
    stockByLocation: [
      { location: 'Myra Fashion LLC', stock: 3 },
      { location: 'Sameera Star Fashion LLC', stock: 2 },
      { location: 'Main Warehouse', stock: 3 },
    ],
  },
  {
    id: 'SAR-COT-005',
    name: 'Cotton Printed Saree',
    brand: 'Fabindia',
    price: 2499,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
    stockByLocation: [
      { location: 'Myra Fashion LLC', stock: 8 },
      { location: 'Sameera Star Fashion LLC', stock: 5 },
      { location: 'Main Warehouse', stock: 5 },
    ],
  },
  {
    id: 'KUR-SLK-006',
    name: 'Silk Embroidered Kurta',
    brand: 'Manyavar',
    price: 3499,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=400&fit=crop',
    stockByLocation: [
      { location: 'Myra Fashion LLC', stock: 6 },
      { location: 'Sameera Star Fashion LLC', stock: 4 },
      { location: 'Main Warehouse', stock: 5 },
    ],
  },
];

const filterOptions: FilterOption[] = ['Myra Fashion LLC', 'Sameera Star Fashion LLC'];

export default function ProductsScreen() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('Myra Fashion LLC');

  const handleLogout = async () => {
    await logout();
    router.replace('/role-selection');
  };

  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      searchQuery === '' ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <SafeAreaView className="flex-1 bg-[#1a1f3a]" edges={['top']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-4 pt-4">
          {/* Header Section */}
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-1">
              <Text className="text-gray-400 text-sm mb-1">Salesman</Text>
              <Text className="text-white text-2xl font-bold">
                {user?.name || 'Salesman'}
              </Text>
            </View>
            <View className="flex-row gap-3">
              <Pressable className="w-10 h-10 bg-[#2d324a] rounded-lg items-center justify-center">
                <Ionicons name="cart-outline" size={20} color="#ffffff" />
              </Pressable>
              <Pressable className="w-10 h-10 bg-[#2d324a] rounded-lg items-center justify-center">
                <Ionicons name="notifications-outline" size={20} color="#ffffff" />
              </Pressable>
              <Pressable
                onPress={handleLogout}
                disabled={isLoading}
                className="w-10 h-10 bg-[#2d324a] rounded-lg items-center justify-center">
                {isLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Ionicons name="log-out-outline" size={20} color="#ffffff" />
                )}
              </Pressable>
            </View>
          </View>

          {/* Search Bar */}
          <View className="mb-4">
            <View className="bg-[#2d324a] rounded-xl flex-row items-center px-4 py-3">
              <Ionicons name="search-outline" size={20} color="#9ca3af" />
              <TextInput
                className="flex-1 ml-3 text-white text-base"
                placeholder="Search by model number..."
                placeholderTextColor="#9ca3af"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* Filter Buttons */}
          <View className="mb-4">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row gap-3">
              {filterOptions.map((filter) => (
                <Pressable
                  key={filter}
                  onPress={() => setSelectedFilter(filter)}
                  className={`px-5 py-2.5 rounded-full ${
                    selectedFilter === filter
                      ? 'bg-[#2a60f7]'
                      : 'bg-[#2d324a]'
                  }`}>
                  <Text
                    className={`text-sm font-semibold ${
                      selectedFilter === filter ? 'text-white' : 'text-gray-400'
                    }`}>
                    {filter}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Product Cards */}
          <View className="gap-4">
            {filteredProducts.map((product) => (
              <View
                key={product.id}
                className="bg-[#2d324a] rounded-2xl p-4 border border-white/5">
                <View className="flex-row">
                  {/* Product Image */}
                  <View className="mr-4">
                    <Image
                      source={{ uri: product.image }}
                      className="w-20 h-20 rounded-xl"
                      contentFit="cover"
                    />
                  </View>

                  {/* Product Details */}
                  <View className="flex-1">
                    <Text className="text-gray-400 text-xs mb-1">{product.id}</Text>
                    <Text className="text-white text-base font-bold mb-1" numberOfLines={1}>
                      {product.name}
                    </Text>
                    <Text className="text-gray-400 text-sm mb-2">{product.brand}</Text>
                    <Text className="text-green-400 text-lg font-bold mb-1">
                      {formatCurrency(product.price)}
                    </Text>
                    <Text className="text-gray-400 text-xs">{product.stock} in stock</Text>
                  </View>

                  {/* Action Buttons */}
                  <View className="items-end justify-between">
                    <View className="flex-row gap-2 mb-2">
                      <TouchableOpacity
                        onPress={() => router.push(`/product-details?id=${product.id}`)}
                        className="w-8 h-8 bg-white/10 rounded-full items-center justify-center">
                        <Ionicons name="eye-outline" size={16} color="#9ca3af" />
                      </TouchableOpacity>
                      <TouchableOpacity className="w-8 h-8 bg-white/10 rounded-full items-center justify-center">
                        <Ionicons name="share-outline" size={16} color="#9ca3af" />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity className="bg-[#2a60f7] px-4 py-2 rounded-lg flex-row items-center">
                      <Ionicons name="add" size={16} color="#ffffff" />
                      <Text className="text-white text-sm font-semibold ml-1">Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {filteredProducts.length === 0 && (
            <View className="items-center justify-center py-12">
              <Ionicons name="search-outline" size={48} color="#9ca3af" />
              <Text className="text-gray-400 text-base mt-4">No products found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
