import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AdminHeader from '@/components/admin-header';

export default function AdminOrdersScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#1a1f3a]">
      <AdminHeader />
      <ScrollView className="flex-1">
        <View className="px-6">
          <Text className="text-white text-2xl font-bold mb-4">Orders</Text>
          <Text className="text-gray-400">Orders management screen coming soon...</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

