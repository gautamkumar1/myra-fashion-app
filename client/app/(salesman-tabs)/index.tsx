import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';

// TypeScript interfaces
interface OrderStatistics {
  todaysOrders: number;
  delivered: number;
  pending: number;
  cancelled: number;
}

type OrderStatus = 'pending' | 'delivered' | 'cancelled';

interface Order {
  id: string;
  customerName: string;
  itemCount: number;
  status: OrderStatus;
  stockFrozen: boolean;
  totalAmount: number;
}

type ShopLocation = 'Myra Fashion LLC' | 'Sameera Star Fashion LLC';

// Mock data
const mockStatistics: OrderStatistics = {
  todaysOrders: 12,
  delivered: 8,
  pending: 4,
  cancelled: 1,
};

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'Priya Sharma',
    itemCount: 3,
    status: 'pending',
    stockFrozen: true,
    totalAmount: 56997,
  },
  {
    id: 'ORD-002',
    customerName: 'Rahul Verma',
    itemCount: 5,
    status: 'delivered',
    stockFrozen: false,
    totalAmount: 125000,
  },
  {
    id: 'ORD-003',
    customerName: 'Anita Patel',
    itemCount: 2,
    status: 'pending',
    stockFrozen: false,
    totalAmount: 45000,
  },
  {
    id: 'ORD-004',
    customerName: 'Vikram Singh',
    itemCount: 4,
    status: 'delivered',
    stockFrozen: false,
    totalAmount: 98000,
  },
];

const shopLocations: ShopLocation[] = ['Myra Fashion LLC', 'Sameera Star Fashion LLC'];

export default function SalesmanHomeScreen() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuthStore();
  const [selectedShop, setSelectedShop] = useState<ShopLocation>('Myra Fashion LLC');

  const handleLogout = async () => {
    await logout();
    router.replace('/role-selection');
  };

  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      case 'delivered':
        return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'cancelled':
        return 'bg-red-500/20 border-red-500/50 text-red-400';
      default:
        return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
    }
  };

  const getStatusText = (status: OrderStatus): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1a1f3a]" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-6 pt-6">
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

          {/* Order Statistics Cards */}
          <View className="mb-6">
            <View className="flex-row flex-wrap gap-4">
              {/* Today's Orders */}
              <View className="bg-[#2d324a] rounded-2xl p-4 flex-1 min-w-[45%]">
                <View className="flex-row items-center mb-2">
                  <View className="w-10 h-10 bg-blue-500/20 rounded-lg items-center justify-center mr-3">
                    <Ionicons name="cart" size={20} color="#60a5fa" />
                  </View>
                </View>
                <Text className="text-gray-400 text-xs mb-1">Today's Orders</Text>
                <Text className="text-white text-2xl font-bold">{mockStatistics.todaysOrders}</Text>
              </View>

              {/* Delivered */}
              <View className="bg-[#2d324a] rounded-2xl p-4 flex-1 min-w-[45%]">
                <View className="flex-row items-center mb-2">
                  <View className="w-10 h-10 bg-green-500/20 rounded-full items-center justify-center mr-3">
                    <Ionicons name="checkmark" size={20} color="#34d399" />
                  </View>
                </View>
                <Text className="text-gray-400 text-xs mb-1">Delivered</Text>
                <Text className="text-white text-2xl font-bold">{mockStatistics.delivered}</Text>
              </View>

              {/* Pending */}
              <View className="bg-[#2d324a] rounded-2xl p-4 flex-1 min-w-[45%]">
                <View className="flex-row items-center mb-2">
                  <View className="w-10 h-10 bg-yellow-500/20 rounded-full items-center justify-center mr-3">
                    <Ionicons name="time-outline" size={20} color="#fbbf24" />
                  </View>
                </View>
                <Text className="text-gray-400 text-xs mb-1">Pending</Text>
                <Text className="text-white text-2xl font-bold">{mockStatistics.pending}</Text>
              </View>

              {/* Cancelled */}
              <View className="bg-[#2d324a] rounded-2xl p-4 flex-1 min-w-[45%]">
                <View className="flex-row items-center mb-2">
                  <View className="w-10 h-10 bg-red-500/20 rounded-full items-center justify-center mr-3">
                    <Ionicons name="close" size={20} color="#f87171" />
                  </View>
                </View>
                <Text className="text-gray-400 text-xs mb-1">Cancelled</Text>
                <Text className="text-white text-2xl font-bold">{mockStatistics.cancelled}</Text>
              </View>
            </View>
          </View>

          {/* Shop Location Selector */}
          <View className="mb-6">
            <Text className="text-white text-lg font-semibold mb-3">Select Shop Location</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row gap-3">
              {shopLocations.map((location) => (
                <Pressable
                  key={location}
                  onPress={() => setSelectedShop(location)}
                  className={`px-6 py-3 rounded-full ${
                    selectedShop === location
                      ? 'bg-[#2a60f7]'
                      : 'bg-[#2d324a]'
                  }`}>
                  <Text
                    className={`text-sm font-semibold ${
                      selectedShop === location ? 'text-white' : 'text-gray-400'
                    }`}>
                    {location}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Recent Orders */}
          <View className="mb-6">
            <Text className="text-white text-lg font-semibold mb-4">Recent Orders</Text>
            <View className="gap-4">
              {mockOrders.map((order) => (
                <View
                  key={order.id}
                  className="bg-[#2d324a] rounded-2xl p-4 border border-white/5">
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <Text className="text-white text-base font-semibold mb-1">
                        {order.id}
                      </Text>
                      <Text className="text-gray-400 text-sm mb-1">{order.customerName}</Text>
                      <Text className="text-gray-500 text-xs">{order.itemCount} items</Text>
                    </View>
                    <View className="items-end">
                      <View
                        className={`px-3 py-1 rounded-lg border mb-2 ${getStatusColor(
                          order.status
                        )}`}>
                        <Text className="text-xs font-semibold">
                          {getStatusText(order.status)}
                        </Text>
                      </View>
                      {order.stockFrozen && (
                        <Text className="text-blue-400 text-xs">Stock Frozen</Text>
                      )}
                    </View>
                  </View>
                  <View className="flex-row justify-end mt-2">
                    <Text className="text-green-400 text-lg font-bold">
                      {formatCurrency(order.totalAmount)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

