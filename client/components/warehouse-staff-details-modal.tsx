import { View, Text, ScrollView, Modal, Pressable, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { getWarehouseStaffDetails, type WarehouseStaffDetails } from '@/utils/api';
import { useAuthStore } from '@/store/authStore';

interface WarehouseStaffDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  warehouseStaffId: string | null;
}

interface DetailRowProps {
  label: string;
  value: string | number | undefined;
  isPassword?: boolean;
}

function DetailRow({ label, value, isPassword = false }: DetailRowProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (value) {
      const textToCopy = String(value);
      if (Platform.OS === 'web' && navigator.clipboard) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // For React Native, we'll use a simple alert approach
        Alert.alert('Copied', textToCopy, [{ text: 'OK' }]);
        return;
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!value && !isPassword) return null;

  return (
    <View className="mb-4">
      <Text className="text-gray-400 text-sm mb-1">{label}</Text>
      <View className="flex-row items-center justify-between bg-[#2d324a] rounded-xl px-4 py-3">
        <Text className="text-white text-base flex-1" numberOfLines={1}>
          {isPassword ? '••••••••••' : String(value)}
        </Text>
        {value && (
          <Pressable onPress={handleCopy} className="ml-2">
            <Ionicons 
              name={copied ? "checkmark-circle" : "copy-outline"} 
              size={20} 
              color={copied ? "#22c55e" : "#9ca3af"} 
            />
          </Pressable>
        )}
      </View>
      {copied && (
        <Text className="text-[#22c55e] text-xs mt-1">Copied to clipboard!</Text>
      )}
    </View>
  );
}

export default function WarehouseStaffDetailsModal({ visible, onClose, warehouseStaffId }: WarehouseStaffDetailsModalProps) {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [warehouseStaff, setWarehouseStaff] = useState<WarehouseStaffDetails | null>(null);

  useEffect(() => {
    if (visible && warehouseStaffId && token) {
      loadWarehouseStaffDetails();
    } else {
      setWarehouseStaff(null);
    }
  }, [visible, warehouseStaffId, token]);

  const loadWarehouseStaffDetails = async () => {
    if (!warehouseStaffId || !token) return;

    try {
      setLoading(true);
      const response = await getWarehouseStaffDetails(warehouseStaffId, token);
      if (response.success) {
        setWarehouseStaff(response.warehouseStaff);
      }
    } catch (error) {
      console.error('Failed to load warehouse staff details:', error);
      Alert.alert('Error', 'Failed to load warehouse staff details. Please try again.');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const copyPassword = async () => {
    if (warehouseStaff?.plainPassword) {
      if (Platform.OS === 'web' && navigator.clipboard) {
        await navigator.clipboard.writeText(warehouseStaff.plainPassword);
        Alert.alert('Success', 'Password copied to clipboard!');
      } else {
        Alert.alert('Password', warehouseStaff.plainPassword, [{ text: 'OK' }]);
      }
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-[#1a1f3a]">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-[#2d324a]">
          <Text className="text-white text-xl font-bold">Warehouse Staff Details</Text>
          <Pressable onPress={onClose} className="w-8 h-8 bg-[#2d324a] rounded-full items-center justify-center">
            <Ionicons name="close" size={20} color="#ffffff" />
          </Pressable>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#22c55e" />
            <Text className="text-gray-400 mt-4">Loading details...</Text>
          </View>
        ) : warehouseStaff ? (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={true}>
            <View className="px-6 py-6">
              {/* Avatar and Name */}
              <View className="items-center mb-6">
                <View className="w-20 h-20 bg-yellow-600 rounded-full items-center justify-center mb-3">
                  <Text className="text-white text-3xl font-bold">
                    {warehouseStaff.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text className="text-white text-2xl font-bold mb-1">{warehouseStaff.name}</Text>
                <View
                  className={`px-4 py-1 rounded-full ${
                    warehouseStaff.status === 'active' ? 'bg-[#22c55e]' : 'bg-gray-500'
                  }`}>
                  <Text className="text-white text-sm font-semibold capitalize">
                    {warehouseStaff.status}
                  </Text>
                </View>
              </View>

              {/* Details Section */}
              <View className="mb-6">
                <Text className="text-white text-lg font-bold mb-4">Personal Information</Text>
                <DetailRow label="Full Name" value={warehouseStaff.name} />
                <DetailRow label="Email" value={warehouseStaff.email} />
                <DetailRow label="Phone" value={warehouseStaff.phone || 'Not provided'} />
              </View>

              <View className="mb-6">
                <Text className="text-white text-lg font-bold mb-4">Work Information</Text>
                <DetailRow label="Warehouse Staff ID" value={warehouseStaff.id.toString()} />
                <DetailRow label="Branch" value={warehouseStaff.branch} />
                <DetailRow label="Warehouse" value={warehouseStaff.warehouse || 'Not assigned'} />
                <DetailRow label="Shift" value={warehouseStaff.shift ? `${warehouseStaff.shift} Shift` : 'Not assigned'} />
                <DetailRow label="Status" value={warehouseStaff.status} />
              </View>

              <View className="mb-6">
                <Text className="text-white text-lg font-bold mb-4">Account Information</Text>
                <View className="mb-4">
                  <Text className="text-gray-400 text-sm mb-1">Password</Text>
                  <View className="flex-row items-center justify-between bg-[#2d324a] rounded-xl px-4 py-3">
                    <Text className="text-white text-base flex-1 font-mono">
                      {warehouseStaff.plainPassword}
                    </Text>
                    <Pressable onPress={copyPassword} className="ml-2">
                      <Ionicons name="copy-outline" size={20} color="#22c55e" />
                    </Pressable>
                  </View>
                  <Text className="text-gray-500 text-xs mt-1">
                    Tap the copy icon to copy password
                  </Text>
                </View>
              </View>

              <View className="mb-6">
                <Text className="text-white text-lg font-bold mb-4">Account Dates</Text>
                <DetailRow label="Created At" value={formatDate(warehouseStaff.createdAt)} />
                {warehouseStaff.updatedAt && (
                  <DetailRow label="Last Updated" value={formatDate(warehouseStaff.updatedAt)} />
                )}
              </View>
            </View>
          </ScrollView>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Ionicons name="alert-circle-outline" size={64} color="#6b7280" />
            <Text className="text-gray-400 text-base mt-4">No details available</Text>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

