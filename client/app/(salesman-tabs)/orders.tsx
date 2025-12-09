import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function OrdersScreen() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace('/role-selection');
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

          <View className="items-center justify-center flex-1">
            <View className="w-20 h-20 bg-yellow-500/20 rounded-2xl items-center justify-center mb-6">
              <Ionicons name="time" size={48} color="#fbbf24" />
            </View>
            <Text className="text-white text-2xl font-bold mb-2">Orders</Text>
            <Text className="text-gray-400 text-base text-center">
              View your orders and transactions
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
