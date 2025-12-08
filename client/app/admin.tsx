import { View, Text, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AdminScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-[#1a1f3a]">
      <View className="flex-1">
        {/* Top Green Section */}
        <View className="bg-[#22c55e] pb-8 rounded-b-3xl">
          <Pressable onPress={() => router.back()} className="absolute top-12 left-6 z-10">
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </Pressable>
          <View className="items-center pt-12 pb-6">
            <View className="w-20 h-20 bg-white/10 rounded-2xl items-center justify-center mb-6">
              <Ionicons name="settings-outline" size={48} color="#ffffff" />
            </View>
            <Text className="text-white text-3xl font-bold mb-2">Admin Login</Text>
            <Text className="text-gray-200 text-base">Full system administration</Text>
          </View>
        </View>

        {/* Login Form Card */}
        <View className="flex-1 px-6 -mt-6">
          <View className="bg-[#1a1f3a] rounded-3xl p-6 shadow-lg border border-white/5">
            {/* Email Field */}
            <View className="mb-6">
              <Text className="text-white text-sm font-semibold mb-2">Email</Text>
              <View className="relative">
                <View className="absolute left-4 top-0 bottom-0 justify-center z-10">
                  <Ionicons name="mail-outline" size={20} color="#9ca3af" />
                </View>
                <TextInput
                  className="bg-[#2d324a] text-white rounded-xl pl-12 pr-4 py-4 text-base"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#6b7280"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Field */}
            <View className="mb-6">
              <Text className="text-white text-sm font-semibold mb-2">Password</Text>
              <View className="relative">
                <View className="absolute left-4 top-0 bottom-0 justify-center z-10">
                  <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" />
                </View>
                <TextInput
                  className="bg-[#2d324a] text-white rounded-xl pl-12 pr-12 py-4 text-base"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#6b7280"
                  secureTextEntry={!showPassword}
                />
                <Pressable
                  className="absolute right-4 top-0 bottom-0 justify-center"
                  onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#9ca3af"
                  />
                </Pressable>
              </View>
            </View>

            {/* Sign In Button */}
            <Pressable className="bg-[#22c55e] rounded-xl py-4 mt-2">
              <Text className="text-white text-lg font-bold text-center">Sign In</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
