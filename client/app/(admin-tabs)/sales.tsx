import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import { getSalesmen, deleteSalesman, type Salesman } from '@/utils/api';
import AdminHeader from '@/components/admin-header';
import SalesmanFormModal from '@/components/salesman-form-modal';
import SalesmanDetailsModal from '@/components/salesman-details-modal';

// Mock data for sales and orders (will be replaced with real data later)
const getMockSalesData = (salesmanId: string) => {
  // Generate consistent mock data based on ID
  const hash = salesmanId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const salesAmount = 500000 + (hash % 2000000); // Between 5L and 25L
  const ordersCount = 50 + (hash % 200); // Between 50 and 250
  
  return {
    salesAmount,
    ordersCount,
  };
};

interface SalesmanCardProps {
  salesman: Salesman;
  onEdit: (salesman: Salesman) => void;
  onDelete: (salesmanId: string) => void;
  onViewDetails: (salesmanId: string) => void;
}

function SalesmanCard({ salesman, onEdit, onDelete, onViewDetails }: SalesmanCardProps) {
  const { salesAmount, ordersCount } = getMockSalesData(salesman._id);
  const initial = salesman.name.charAt(0).toUpperCase();
  const formattedSales = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(salesAmount);

  return (
    <View className="bg-[#2d324a] rounded-xl p-4 mb-4">
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center mr-3">
            <Text className="text-white text-lg font-bold">{initial}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-white text-lg font-bold mb-1">{salesman.name}</Text>
            <Text className="text-gray-400 text-sm">{salesman.branch}</Text>
            {salesman.region && (
              <Text className="text-gray-400 text-sm">{salesman.region} Region</Text>
            )}
          </View>
        </View>
        <View
          className={`px-3 py-1 rounded-lg ${
            salesman.status === 'active' ? 'bg-[#22c55e]' : 'bg-gray-500'
          }`}>
          <Text className="text-white text-xs font-semibold capitalize">
            {salesman.status}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center mb-4">
        <Text className="text-[#22c55e] text-base font-semibold mr-4">{formattedSales}</Text>
        <Text className="text-gray-400 text-sm">{ordersCount} orders</Text>
      </View>

      <Pressable
        onPress={() => onViewDetails(salesman._id)}
        className="bg-[#2d324a] border border-blue-500/50 rounded-lg py-3 items-center mb-2">
        <Text className="text-blue-400 font-semibold">View Details</Text>
      </Pressable>

      <View className="flex-row">
        <Pressable
          onPress={() => onEdit(salesman)}
          className="flex-1 bg-[#2d324a] border border-[#4b5563] rounded-lg py-3 items-center mr-2">
          <Text className="text-white font-semibold">Edit</Text>
        </Pressable>
        <Pressable
          onPress={() => onDelete(salesman._id)}
          className="flex-1 bg-[#2d324a] border border-red-500/50 rounded-lg py-3 items-center">
          <Text className="text-red-400 font-semibold">Remove</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function AdminSalesScreen() {
  const { token } = useAuthStore();
  const [salesmen, setSalesmen] = useState<Salesman[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [editingSalesman, setEditingSalesman] = useState<Salesman | null>(null);
  const [viewingSalesmanId, setViewingSalesmanId] = useState<string | null>(null);

  const loadSalesmen = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getSalesmen(token);
      if (response.success) {
        setSalesmen(response.salesmen);
      }
    } catch (error) {
      console.error('Failed to load salesmen:', error);
      Alert.alert('Error', 'Failed to load salesmen. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      loadSalesmen();
    }, [loadSalesmen])
  );

  const handleAddSalesman = () => {
    setEditingSalesman(null);
    setModalVisible(true);
  };

  const handleEditSalesman = (salesman: Salesman) => {
    setEditingSalesman(salesman);
    setModalVisible(true);
  };

  const handleDeleteSalesman = async (salesmanId: string) => {
    if (!token) {
      Alert.alert('Error', 'Authentication required. Please login again.');
      return;
    }

    const performDelete = async () => {
      try {
        setLoading(true);
        const response = await deleteSalesman(salesmanId, token);
        
        if (response && response.success) {
          Alert.alert('Success', 'Salesman deleted successfully!');
          await loadSalesmen();
        } else {
          Alert.alert('Error', response?.message || 'Failed to delete salesman.');
        }
      } catch (error) {
        console.error('Delete salesman error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete salesman. Please try again.';
        Alert.alert('Error', errorMessage);
      } finally {
        setLoading(false);
      }
    };

    // Use window.confirm for web platform, Alert.alert for native
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.confirm) {
      const confirmed = window.confirm('Are you sure you want to delete this salesman? This action cannot be undone.');
      if (confirmed) {
        await performDelete();
      }
    } else {
      Alert.alert(
        'Delete Salesman',
        'Are you sure you want to delete this salesman? This action cannot be undone.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: performDelete,
          },
        ],
        { cancelable: true }
      );
    }
  };

  const handleModalSuccess = () => {
    loadSalesmen();
  };

  const handleViewDetails = (salesmanId: string) => {
    setViewingSalesmanId(salesmanId);
    setDetailsModalVisible(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1a1f3a]">
      <AdminHeader />
      {/* Page Header */}
      <View className="px-6 pb-4 flex-row items-center justify-between">
        <Text className="text-white text-2xl font-bold">Salesmen</Text>
        <Pressable
          onPress={handleAddSalesman}
          className="bg-[#22c55e] rounded-xl px-4 py-2 flex-row items-center">
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text className="text-white font-semibold ml-2">Add</Text>
        </Pressable>
      </View>

      {/* Salesmen List */}
      <ScrollView 
        className="flex-1 px-6" 
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled">
        {loading ? (
          <View className="py-8">
            <ActivityIndicator size="large" color="#22c55e" />
          </View>
        ) : salesmen.length === 0 ? (
          <View className="py-8 items-center">
            <Ionicons name="people-outline" size={64} color="#6b7280" />
            <Text className="text-gray-400 text-base mt-4">No salesmen found</Text>
          </View>
        ) : (
          salesmen.map((salesman) => (
            <SalesmanCard
              key={salesman._id}
              salesman={salesman}
              onEdit={handleEditSalesman}
              onDelete={handleDeleteSalesman}
              onViewDetails={handleViewDetails}
            />
          ))
        )}
      </ScrollView>

      {/* Salesman Form Modal */}
      <SalesmanFormModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingSalesman(null);
        }}
        onSuccess={handleModalSuccess}
        salesman={editingSalesman}
      />

      {/* Salesman Details Modal */}
      <SalesmanDetailsModal
        visible={detailsModalVisible}
        onClose={() => {
          setDetailsModalVisible(false);
          setViewingSalesmanId(null);
        }}
        salesmanId={viewingSalesmanId}
      />
    </SafeAreaView>
  );
}
