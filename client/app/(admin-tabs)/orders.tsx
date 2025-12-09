import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdminOrdersScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#1a1f3a]">
      <ScrollView className="flex-1">
        <View className="px-6 pt-6">
          <Text className="text-white text-2xl font-bold mb-4">Orders</Text>
          <Text className="text-gray-400">Orders management screen coming soon...</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

