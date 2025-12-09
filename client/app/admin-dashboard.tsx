import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { getDashboardStats, type DashboardStats } from '@/utils/api';

interface DashboardCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  count: number;
  iconColor: string;
  iconBgColor: string;
}

function DashboardCard({ icon, title, count, iconColor, iconBgColor }: DashboardCardProps) {
  return (
    <View className="bg-[#2d324a] rounded-2xl p-5 flex-1 min-w-[45%]">
      <View className="w-12 h-12 rounded-xl items-center justify-center mb-3" style={{ backgroundColor: iconBgColor }}>
        <Ionicons name={icon} size={24} color={iconColor} />
      </View>
      <Text className="text-gray-400 text-sm mb-1">{title}</Text>
      <Text className="text-white text-3xl font-bold">{count}</Text>
    </View>
  );
}

interface QuickActionProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBgColor: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}

function QuickAction({ icon, iconColor, iconBgColor, title, subtitle, onPress }: QuickActionProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-[#2d324a] rounded-2xl p-4 mb-3 flex-row items-center">
      <View className="w-12 h-12 rounded-full items-center justify-center mr-4" style={{ backgroundColor: iconBgColor }}>
        <Ionicons name={icon} size={24} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text className="text-white text-base font-semibold mb-1">{title}</Text>
        <Text className="text-gray-400 text-sm">{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    </Pressable>
  );
}

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { logout, user, token } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats['stats'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadDashboardStats();
    }
  }, [token]);

  const loadDashboardStats = async () => {
    if (!token) {
      setStats({
        products: 5,
        salesmen: 4,
        warehouseStaff: 3,
        pendingOrders: 2,
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getDashboardStats(token);
      if (response.success) {
        setStats(response.stats);
      }
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
      // Fallback to mock data if API fails
      setStats({
        products: 5,
        salesmen: 4,
        warehouseStaff: 3,
        pendingOrders: 2,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/role-selection');
  };

  const handleAddProduct = () => {
    // TODO: Navigate to add product screen
    console.log('Navigate to add product');
  };

  const handleApproveOrders = () => {
    // TODO: Navigate to approve orders screen
    console.log('Navigate to approve orders');
  };

  const handleViewReports = () => {
    // TODO: Navigate to reports screen
    console.log('Navigate to reports');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1a1f3a]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Section */}
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
            <View className="flex-row items-center gap-4">
              <Pressable className="relative">
                <Ionicons name="notifications-outline" size={24} color="#ffffff" />
                <View className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full items-center justify-center">
                  <Text className="text-white text-xs font-bold">5</Text>
                </View>
              </Pressable>
              <Pressable onPress={handleLogout}>
                <Ionicons name="exit-outline" size={24} color="#ffffff" />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Dashboard Cards */}
        <View className="px-6 mb-6">
          {loading ? (
            <View className="py-8">
              <ActivityIndicator size="large" color="#14b8a6" />
            </View>
          ) : (
            <View className="flex-row flex-wrap gap-4">
              <DashboardCard
                icon="cube-outline"
                title="Products"
                count={stats?.products || 0}
                iconColor="#14b8a6"
                iconBgColor="rgba(20, 184, 166, 0.2)"
              />
              <DashboardCard
                icon="people-outline"
                title="Salesmen"
                count={stats?.salesmen || 0}
                iconColor="#60a5fa"
                iconBgColor="rgba(96, 165, 250, 0.2)"
              />
              <DashboardCard
                icon="business-outline"
                title="Warehouse Staff"
                count={stats?.warehouseStaff || 0}
                iconColor="#fbbf24"
                iconBgColor="rgba(251, 191, 36, 0.2)"
              />
              <DashboardCard
                icon="time-outline"
                title="Pending Orders"
                count={stats?.pendingOrders || 0}
                iconColor="#ef4444"
                iconBgColor="rgba(239, 68, 68, 0.2)"
              />
            </View>
          )}
        </View>

        {/* Quick Actions Section */}
        <View className="px-6 mb-6">
          <Text className="text-white text-xl font-bold mb-4">Quick Actions</Text>
          <QuickAction
            icon="add-circle"
            iconColor="#22c55e"
            iconBgColor="rgba(34, 197, 94, 0.2)"
            title="Add New Product"
            subtitle="Add products with photos"
            onPress={handleAddProduct}
          />
          <QuickAction
            icon="document-text-outline"
            iconColor="#fbbf24"
            iconBgColor="rgba(251, 191, 36, 0.2)"
            title="Approve Orders"
            subtitle="2 pending approvals"
            onPress={handleApproveOrders}
          />
          <QuickAction
            icon="bar-chart-outline"
            iconColor="#60a5fa"
            iconBgColor="rgba(96, 165, 250, 0.2)"
            title="View Reports"
            subtitle="Stock, sales, movements"
            onPress={handleViewReports}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

