import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';

export default function ProfileScreen() {
  const { user } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-[#1a1f3a]" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-6 pt-6">
          <View className="items-center justify-center flex-1">
            <View className="w-20 h-20 bg-green-500/20 rounded-2xl items-center justify-center mb-6">
              <Ionicons name="person" size={48} color="#34d399" />
            </View>
            <Text className="text-white text-2xl font-bold mb-2">Profile</Text>
            {user && (
              <View className="items-center mt-4">
                <Text className="text-gray-400 text-base mb-1">{user.name}</Text>
                <Text className="text-gray-500 text-sm">{user.email}</Text>
              </View>
            )}
            <Text className="text-gray-400 text-base text-center mt-4">
              Manage your profile settings
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

