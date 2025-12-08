import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';

export default function WarehouseDashboardScreen() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace('/role-selection');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1a1f3a]">
      <View className="flex-1 px-6 pt-12">
        {/* Header */}
        <View className="items-center mb-12">
          <View className="w-20 h-20 bg-orange-500/20 rounded-2xl items-center justify-center mb-6">
            <Ionicons name="cube" size={48} color="#f97316" />
          </View>
          <Text className="text-white text-3xl font-bold mb-2">Welcome</Text>
          {user && (
            <Text className="text-gray-400 text-base">{user.name || user.email}</Text>
          )}
        </View>

        {/* Content Area */}
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-lg mb-8 text-center">
            You are logged in as a Warehouse Keeper
          </Text>
        </View>

        {/* Logout Button */}
        <View className="pb-8">
          <Pressable
            className={`rounded-xl py-4 ${isLoading ? 'bg-red-500/50' : 'bg-red-500'}`}
            onPress={handleLogout}
            disabled={isLoading}>
            {isLoading ? (
              <View className="flex-row items-center justify-center">
                <ActivityIndicator size="small" color="#ffffff" />
                <Text className="text-white text-lg font-bold ml-2">Logging Out...</Text>
              </View>
            ) : (
              <View className="flex-row items-center justify-center">
                <Ionicons name="log-out-outline" size={20} color="#ffffff" />
                <Text className="text-white text-lg font-bold ml-2">Logout</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

