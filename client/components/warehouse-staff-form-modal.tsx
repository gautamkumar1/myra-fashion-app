import { View, Text, TextInput, Pressable, ScrollView, Modal, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createWarehouseStaff, updateWarehouseStaff, type WarehouseStaff, type CreateWarehouseStaffData, type UpdateWarehouseStaffData } from '@/utils/api';
import { useAuthStore } from '@/store/authStore';

interface WarehouseStaffFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  warehouseStaff?: WarehouseStaff | null;
}

const WAREHOUSES = ['WH-001 (Main)', 'WH-002 (West)'];
const SHIFTS = ['Morning', 'Evening', 'Night'];

export default function WarehouseStaffFormModal({ visible, onClose, onSuccess, warehouseStaff }: WarehouseStaffFormModalProps) {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [warehouse, setWarehouse] = useState('WH-001 (Main)');
  const [shift, setShift] = useState('Morning');
  const [showWarehousePicker, setShowWarehousePicker] = useState(false);
  const [showShiftPicker, setShowShiftPicker] = useState(false);

  useEffect(() => {
    if (warehouseStaff) {
      setName(warehouseStaff.name);
      setEmail(warehouseStaff.email);
      setPhone(warehouseStaff.phone || '');
      setWarehouse(warehouseStaff.warehouse || 'WH-001 (Main)');
      setShift(warehouseStaff.shift || 'Morning');
    } else {
      // Reset form for new warehouse staff
      setName('');
      setEmail('');
      setPhone('');
      setWarehouse('WH-001 (Main)');
      setShift('Morning');
    }
    // Close pickers when modal visibility changes
    setShowWarehousePicker(false);
    setShowShiftPicker(false);
  }, [warehouseStaff, visible]);

  const formatPhoneNumber = (text: string) => {
    // Remove all non-digit characters
    const digits = text.replace(/\D/g, '');
    
    // Format as +91 98765-43210
    if (digits.length === 0) return '';
    if (digits.length <= 2) return `+${digits}`;
    if (digits.length <= 7) return `+${digits.slice(0, 2)} ${digits.slice(2)}`;
    return `+${digits.slice(0, 2)} ${digits.slice(2, 7)}-${digits.slice(7, 12)}`;
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhone(formatted);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Validation Error', 'Please fill in all required fields (Name and Email).');
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }

    if (!token) {
      Alert.alert('Error', 'Authentication required. Please login again.');
      return;
    }

    try {
      setLoading(true);

      if (warehouseStaff) {
        // Update existing warehouse staff
        const updateData: UpdateWarehouseStaffData = {
          name: name.trim(),
          email: email.trim(),
          branch: 'Myra Fashion LLC',
          phone: phone.trim() || undefined,
          shift: shift || undefined,
          warehouse: warehouse || undefined,
        };

        await updateWarehouseStaff(warehouseStaff._id, updateData, token);
        Alert.alert('Success', 'Warehouse staff updated successfully!');
      } else {
        // Create new warehouse staff
        const createData: CreateWarehouseStaffData = {
          name: name.trim(),
          email: email.trim(),
          branch: 'Myra Fashion LLC',
          phone: phone.trim() || undefined,
          shift: shift || undefined,
          warehouse: warehouse || undefined,
        };

        await createWarehouseStaff(createData, token);
        Alert.alert('Success', 'Warehouse staff created successfully!');
      }

      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save warehouse staff. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
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
          <Text className="text-white text-xl font-bold">
            {warehouseStaff ? 'Edit Warehouse Staff' : 'Add Warehouse Staff'}
          </Text>
          <Pressable onPress={onClose} className="w-8 h-8 bg-[#2d324a] rounded-full items-center justify-center">
            <Ionicons name="close" size={20} color="#ffffff" />
          </Pressable>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1">
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}>
            <View className="px-6 py-6">
              {/* Full Name */}
              <View className="mb-4">
                <Text className="text-white text-sm font-semibold mb-2">Full Name</Text>
                <TextInput
                  className="bg-[#2d324a] text-white rounded-xl px-4 py-4 text-base"
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g., Rahul Sharma"
                  placeholderTextColor="#6b7280"
                />
              </View>

              {/* Email */}
              <View className="mb-4">
                <Text className="text-white text-sm font-semibold mb-2">Email</Text>
                <View className="relative">
                  <TextInput
                    className="bg-[#2d324a] text-white rounded-xl px-4 py-4 text-base pr-12"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="e.g., rahul@myrafashion.com"
                    placeholderTextColor="#6b7280"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <View className="absolute right-4 top-0 bottom-0 justify-center">
                    <Ionicons name="mail-outline" size={20} color="#22c55e" />
                  </View>
                </View>
              </View>

              {/* Phone */}
              <View className="mb-4">
                <Text className="text-white text-sm font-semibold mb-2">Phone</Text>
                <TextInput
                  className="bg-[#2d324a] text-white rounded-xl px-4 py-4 text-base"
                  value={phone}
                  onChangeText={handlePhoneChange}
                  placeholder="e.g., +91 98765-43210"
                  placeholderTextColor="#6b7280"
                  keyboardType="phone-pad"
                />
              </View>

              {/* Warehouse */}
              <View className="mb-4">
                <Text className="text-white text-sm font-semibold mb-2">Warehouse</Text>
                <Pressable
                  onPress={() => {
                    setShowWarehousePicker(!showWarehousePicker);
                    setShowShiftPicker(false);
                  }}
                  className="bg-[#2d324a] rounded-xl px-4 py-4 flex-row items-center justify-between">
                  <Text className="text-white text-base">{warehouse}</Text>
                  <Ionicons name="chevron-down" size={20} color="#9ca3af" />
                </Pressable>
                {showWarehousePicker && (
                  <View className="bg-[#2d324a] rounded-xl mt-2 overflow-hidden">
                    {WAREHOUSES.map((wh) => (
                      <Pressable
                        key={wh}
                        onPress={() => {
                          setWarehouse(wh);
                          setShowWarehousePicker(false);
                        }}
                        className="px-4 py-3 border-b border-[#1a1f3a] last:border-b-0">
                        <Text className={`text-base ${warehouse === wh ? 'text-[#22c55e] font-semibold' : 'text-white'}`}>
                          {wh}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              {/* Shift */}
              <View className="mb-6">
                <Text className="text-white text-sm font-semibold mb-2">Shift</Text>
                <Pressable
                  onPress={() => {
                    setShowShiftPicker(!showShiftPicker);
                    setShowWarehousePicker(false);
                  }}
                  className="bg-[#2d324a] rounded-xl px-4 py-4 flex-row items-center justify-between">
                  <Text className="text-white text-base">{shift}</Text>
                  <Ionicons name="chevron-down" size={20} color="#9ca3af" />
                </Pressable>
                {showShiftPicker && (
                  <View className="bg-[#2d324a] rounded-xl mt-2 overflow-hidden">
                    {SHIFTS.map((s) => (
                      <Pressable
                        key={s}
                        onPress={() => {
                          setShift(s);
                          setShowShiftPicker(false);
                        }}
                        className="px-4 py-3 border-b border-[#1a1f3a] last:border-b-0">
                        <Text className={`text-base ${shift === s ? 'text-[#22c55e] font-semibold' : 'text-white'}`}>
                          {s}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              {/* Submit Button */}
              <Pressable
                onPress={handleSubmit}
                disabled={loading}
                className={`bg-[#22c55e] rounded-xl py-4 mt-2 ${loading ? 'opacity-50' : ''}`}>
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="text-white text-lg font-bold text-center">
                    {warehouseStaff ? 'Update Warehouse Staff' : 'Add Warehouse Staff'}
                  </Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

