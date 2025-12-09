import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function AdminSettingsScreen() {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace('/role-selection');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1a1f3a]">
      <ScrollView className="flex-1">
        <View className="px-6 pt-6">
          <Text className="text-white text-2xl font-bold mb-4">Settings</Text>
          <Pressable
            onPress={handleLogout}
            className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mt-4">
            <Text className="text-red-400 text-center font-semibold">Logout</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

