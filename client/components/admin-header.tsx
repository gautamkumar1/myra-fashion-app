import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';

export default function AdminHeader() {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace('/role-selection');
  };

  return (
    <View className="px-6 pt-6 pb-4">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 bg-teal-500/20 rounded-xl items-center justify-center mr-4">
            <Ionicons name="settings" size={24} color="#14b8a6" />
          </View>
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold">Admin Panel</Text>
            <Text className="text-gray-400 text-sm">Myra & Sameera Fashions</Text>
          </View>
        </View>
        <Pressable onPress={handleLogout}>
          <Ionicons name="exit-outline" size={24} color="#ffffff" />
        </Pressable>
      </View>
    </View>
  );
}

