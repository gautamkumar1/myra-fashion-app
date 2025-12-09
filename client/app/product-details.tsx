import { View, Text, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';

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

export default function ProductDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <SafeAreaView className="flex-1 bg-[#1a1f3a]" edges={['top']}>
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons name="alert-circle-outline" size={48} color="#9ca3af" />
          <Text className="text-gray-400 text-base mt-4">Product not found</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-6 bg-[#2a60f7] px-6 py-3 rounded-lg">
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Share product:', product.id);
  };

  const handleAddToCart = () => {
    // Implement add to cart functionality
    console.log('Add to cart:', product.id);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1a1f3a]" edges={['top']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header with Back Button */}
        <View className="px-4 pt-4 pb-2">
          <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </Pressable>
        </View>

        {/* Product Image */}
        <View className="w-full h-96 mb-6">
          <Image
            source={{ uri: product.image }}
            className="w-full h-full"
            contentFit="cover"
            transition={200}
          />
        </View>

        {/* Product Information */}
        <View className="px-4 mb-6">
          <Text className="text-gray-400 text-sm mb-2">{product.id}</Text>
          <Text className="text-white text-3xl font-bold mb-2">{product.name}</Text>
          <Text className="text-gray-400 text-lg mb-4">{product.brand}</Text>
          <Text className="text-green-400 text-3xl font-bold mb-6">
            {formatCurrency(product.price)}
          </Text>

          {/* Stock by Location */}
          <View className="mb-6">
            <Text className="text-white text-xl font-bold mb-4">Stock by Location</Text>
            <View className="gap-3">
              {product.stockByLocation.map((locationStock, index) => (
                <View
                  key={index}
                  className="bg-[#2d324a] rounded-xl px-4 py-4 flex-row items-center justify-between">
                  <Text className="text-white text-base">{locationStock.location}</Text>
                  <Text className="text-gray-400 text-base">{locationStock.stock} pcs</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="absolute bottom-0 left-0 right-0 bg-[#1a1f3a] border-t border-white/10 px-4 py-4 pb-safe">
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={handleShare}
            className="flex-1 bg-[#2d324a] rounded-xl py-4 flex-row items-center justify-center">
            <Ionicons name="share-outline" size={20} color="#ffffff" />
            <Text className="text-white font-semibold ml-2">Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleAddToCart}
            className="flex-1 bg-[#2a60f7] rounded-xl py-4 flex-row items-center justify-center">
            <Ionicons name="add" size={20} color="#ffffff" />
            <Text className="text-white font-semibold ml-2">Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

