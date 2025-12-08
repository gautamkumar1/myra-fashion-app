import { View, Text, Pressable } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RoleSelectionScreen() {
  const router = useRouter();

  const roles = [
    {
      id: 'salesman',
      title: 'Salesman',
      description: 'Access customer data & sales',
      icon: 'people' as const,
      iconColor: '#60a5fa',
      route: '/salesman' as Href,
    },
    {
      id: 'warehouse',
      title: 'Warehouse Keeper',
      description: 'Manage inventory & shipments',
      icon: 'cube' as const,
      iconColor: '#fbbf24',
      route: '/warehouse' as Href,
    },
    {
      id: 'admin',
      title: 'Admin',
      description: 'Full system administration',
      icon: 'settings' as const,
      iconColor: '#14b8a6',
      route: '/admin' as Href,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#1a1f3a]">
      <View className="flex-1 px-6 pt-12">
        {/* Welcome Section */}
        <View className="items-center mb-12">
          <View className="w-20 h-20 bg-blue-500/20 rounded-2xl items-center justify-center mb-6">
            <Ionicons name="shield-checkmark" size={48} color="#60a5fa" />
          </View>
          <Text className="text-white text-3xl font-bold mb-2">Welcome Back</Text>
          <Text className="text-gray-400 text-base">Select your role to continue</Text>
        </View>

        {/* Role Cards */}
        <View className="flex-1 gap-4">
          {roles.map((role) => (
            <Pressable
              key={role.id}
              onPress={() => router.push(role.route)}
              className="bg-white/5 rounded-2xl p-5 flex-row items-center border border-white/10 active:bg-white/10">
              <View className="w-14 h-14 rounded-xl items-center justify-center mr-4" style={{ backgroundColor: `${role.iconColor}20` }}>
                <Ionicons name={role.icon} size={28} color={role.iconColor} />
              </View>
              <View className="flex-1">
                <Text className="text-white text-lg font-bold mb-1">{role.title}</Text>
                <Text className="text-gray-400 text-sm">{role.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

