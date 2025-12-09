import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AdminHeader from '@/components/admin-header';
import WarehouseStaffFormModal from '@/components/warehouse-staff-form-modal';
import WarehouseStaffDetailsModal from '@/components/warehouse-staff-details-modal';
import { getWarehouseStaff, deleteWarehouseStaff, type WarehouseStaff } from '@/utils/api';
import { useAuthStore } from '@/store/authStore';

export default function AdminStaffScreen() {
  const { token } = useAuthStore();
  const [warehouseStaff, setWarehouseStaff] = useState<WarehouseStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<WarehouseStaff | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      loadWarehouseStaff();
    }
  }, [token]);

  const loadWarehouseStaff = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await getWarehouseStaff(token);
      if (response.success) {
        setWarehouseStaff(response.warehouseStaff);
      }
    } catch (error) {
      console.error('Failed to load warehouse staff:', error);
      Alert.alert('Error', 'Failed to load warehouse staff. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPress = () => {
    setSelectedStaff(null);
    setShowAddModal(true);
  };

  const handleEditPress = (staff: WarehouseStaff) => {
    setSelectedStaff(staff);
    setShowAddModal(true);
  };

  const handleViewDetails = (staffId: string) => {
    setSelectedStaffId(staffId);
    setShowDetailsModal(true);
  };

  const handleDeletePress = (staff: WarehouseStaff) => {
    console.log('handleDeletePress called for staff:', staff._id, staff.name);
    
    if (!token) {
      Alert.alert('Error', 'Authentication required. Please login again.');
      return;
    }

    const performDelete = async () => {
      try {
        console.log('Deleting warehouse staff:', staff._id);
        const response = await deleteWarehouseStaff(staff._id, token);
        console.log('Delete response:', response);
        if (response && response.success) {
          Alert.alert('Success', 'Warehouse staff removed successfully!');
          await loadWarehouseStaff();
        } else {
          Alert.alert('Error', response?.message || 'Failed to remove warehouse staff.');
        }
      } catch (error) {
        console.error('Delete error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to remove warehouse staff.';
        Alert.alert('Error', errorMessage);
      }
    };

    // Use window.confirm for web platform, Alert.alert for native
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.confirm) {
      const confirmed = window.confirm(`Are you sure you want to remove ${staff.name}? This action cannot be undone.`);
      if (confirmed) {
        performDelete();
      }
    } else {
      Alert.alert(
        'Remove Warehouse Staff',
        `Are you sure you want to remove ${staff.name}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: performDelete,
          },
        ],
        { cancelable: true }
      );
    }
  };

  const handleModalSuccess = () => {
    loadWarehouseStaff();
  };

  interface WarehouseStaffCardProps {
    staff: WarehouseStaff;
    onEdit: (staff: WarehouseStaff) => void;
    onDelete: (staff: WarehouseStaff) => void;
    onViewDetails: (staffId: string) => void;
  }

  function WarehouseStaffCard({ staff, onEdit, onDelete, onViewDetails }: WarehouseStaffCardProps) {
    const initial = staff.name.charAt(0).toUpperCase();

    return (
      <View className="bg-[#2d324a] rounded-xl p-4 mb-4">
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-row items-center flex-1">
            <View className="w-12 h-12 bg-yellow-600 rounded-full items-center justify-center mr-3">
              <Text className="text-white text-lg font-bold">{initial}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-white text-lg font-bold mb-1">{staff.name}</Text>
              <Text className="text-gray-400 text-sm">{staff.branch}</Text>
              {staff.warehouse && (
                <Text className="text-gray-400 text-sm">{staff.warehouse}</Text>
              )}
              {staff.shift && (
                <Text className="text-gray-400 text-sm">{staff.shift} Shift</Text>
              )}
            </View>
          </View>
          <View
            className={`px-3 py-1 rounded-lg ${
              staff.status === 'active' ? 'bg-[#22c55e]' : 'bg-gray-500'
            }`}>
            <Text className="text-white text-xs font-semibold capitalize">
              {staff.status}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => onViewDetails(staff._id)}
          className="bg-[#2d324a] border border-blue-500/50 rounded-lg py-3 items-center mb-2">
          <Text className="text-blue-400 font-semibold">View Details</Text>
        </Pressable>

        <View className="flex-row">
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onEdit(staff);
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            className="flex-1 bg-[#2d324a] border border-[#4b5563] rounded-lg py-3 items-center mr-2">
            <Text className="text-white font-semibold">Edit</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              console.log('Remove button pressed for staff:', staff._id, staff.name);
              onDelete(staff);
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            className="flex-1 bg-[#2d324a] border border-red-500/50 rounded-lg py-3 items-center">
            <Text className="text-red-400 font-semibold">Remove</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#1a1f3a]">
      <AdminHeader />
      {/* Page Header */}
      <View className="px-6 pb-4 flex-row items-center justify-between">
        <Text className="text-white text-2xl font-bold">Warehouse Staff</Text>
        <Pressable
          onPress={handleAddPress}
          className="bg-[#22c55e] rounded-xl px-4 py-2 flex-row items-center">
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text className="text-white font-semibold ml-2">Add</Text>
        </Pressable>
      </View>

      {/* Warehouse Staff List */}
      <ScrollView 
        className="flex-1 px-6" 
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled">
        {loading ? (
          <View className="py-8">
            <ActivityIndicator size="large" color="#22c55e" />
          </View>
        ) : warehouseStaff.length === 0 ? (
          <View className="py-8 items-center">
            <Ionicons name="people-outline" size={64} color="#6b7280" />
            <Text className="text-gray-400 text-base mt-4">No warehouse staff found</Text>
            <Pressable
              onPress={handleAddPress}
              className="bg-[#22c55e] px-6 py-3 rounded-lg mt-4">
              <Text className="text-white font-semibold">Add First Staff Member</Text>
            </Pressable>
          </View>
        ) : (
          warehouseStaff.map((staff) => (
            <WarehouseStaffCard
              key={staff._id}
              staff={staff}
              onEdit={handleEditPress}
              onDelete={handleDeletePress}
              onViewDetails={handleViewDetails}
            />
          ))
        )}
      </ScrollView>

      {/* Modals */}
      <WarehouseStaffFormModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleModalSuccess}
        warehouseStaff={selectedStaff}
      />

      <WarehouseStaffDetailsModal
        visible={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedStaffId(null);
        }}
        warehouseStaffId={selectedStaffId}
      />
    </SafeAreaView>
  );
}

