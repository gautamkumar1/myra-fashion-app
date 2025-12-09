import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function OrdersScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#1a1f3a]" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-6 pt-6">
          <View className="items-center justify-center flex-1">
            <View className="w-20 h-20 bg-blue-500/20 rounded-2xl items-center justify-center mb-6">
              <Ionicons name="cube" size={48} color="#60a5fa" />
            </View>
            <Text className="text-white text-2xl font-bold mb-2">Orders</Text>
            <Text className="text-gray-400 text-base text-center">
              Your orders and packages will appear here
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

