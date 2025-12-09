import { View, Text, TextInput, Pressable, ScrollView, Modal, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createSalesman, updateSalesman, type Salesman, type CreateSalesmanData, type UpdateSalesmanData } from '@/utils/api';
import { useAuthStore } from '@/store/authStore';

interface SalesmanFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  salesman?: Salesman | null;
}

const COMPANIES = ['Myra Fashion LLC', 'Sameera Star Fashion LLC'];
const REGIONS = ['North', 'South', 'East', 'West'];

export default function SalesmanFormModal({ visible, onClose, onSuccess, salesman }: SalesmanFormModalProps) {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('Myra Fashion LLC');
  const [region, setRegion] = useState('');
  const [showCompanyPicker, setShowCompanyPicker] = useState(false);
  const [showRegionPicker, setShowRegionPicker] = useState(false);

  useEffect(() => {
    if (salesman) {
      setName(salesman.name);
      setEmail(salesman.email);
      setPhone(salesman.phone || '');
      setCompany(salesman.branch || 'Myra Fashion LLC');
      setRegion(salesman.region || '');
    } else {
      // Reset form for new salesman
      setName('');
      setEmail('');
      setPhone('');
      setCompany('Myra Fashion LLC');
      setRegion('');
    }
    // Close pickers when modal visibility changes
    setShowCompanyPicker(false);
    setShowRegionPicker(false);
  }, [salesman, visible]);

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

      if (salesman) {
        // Update existing salesman
        const updateData: UpdateSalesmanData = {
          name: name.trim(),
          email: email.trim(),
          branch: company,
          phone: phone.trim() || undefined,
          region: region || undefined,
        };

        await updateSalesman(salesman._id, updateData, token);
        Alert.alert('Success', 'Salesman updated successfully!');
      } else {
        // Create new salesman
        const createData: CreateSalesmanData = {
          name: name.trim(),
          email: email.trim(),
          branch: company,
          phone: phone.trim() || undefined,
          region: region || undefined,
        };

        await createSalesman(createData, token);
        Alert.alert('Success', 'Salesman created successfully!');
      }

      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save salesman. Please try again.';
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
            {salesman ? 'Edit Salesman' : 'Add Salesman'}
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

              {/* Shop Assignment */}
              <View className="mb-4">
                <Text className="text-white text-sm font-semibold mb-2">Shop Assignment</Text>
                <Pressable
                  onPress={() => {
                    setShowCompanyPicker(!showCompanyPicker);
                    setShowRegionPicker(false);
                  }}
                  className="bg-[#2d324a] rounded-xl px-4 py-4 flex-row items-center justify-between">
                  <Text className="text-white text-base">{company}</Text>
                  <Ionicons name="chevron-down" size={20} color="#9ca3af" />
                </Pressable>
                {showCompanyPicker && (
                  <View className="bg-[#2d324a] rounded-xl mt-2 overflow-hidden">
                    {COMPANIES.map((comp) => (
                      <Pressable
                        key={comp}
                        onPress={() => {
                          setCompany(comp);
                          setShowCompanyPicker(false);
                        }}
                        className="px-4 py-3 border-b border-[#1a1f3a] last:border-b-0">
                        <Text className={`text-base ${company === comp ? 'text-[#22c55e] font-semibold' : 'text-white'}`}>
                          {comp}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              {/* Region */}
              <View className="mb-6">
                <Text className="text-white text-sm font-semibold mb-2">Region</Text>
                <Pressable
                  onPress={() => {
                    setShowRegionPicker(!showRegionPicker);
                    setShowCompanyPicker(false);
                  }}
                  className="bg-[#2d324a] rounded-xl px-4 py-4 flex-row items-center justify-between">
                  <Text className="text-white text-base">{region || 'Select Region'}</Text>
                  <Ionicons name="chevron-down" size={20} color="#9ca3af" />
                </Pressable>
                {showRegionPicker && (
                  <View className="bg-[#2d324a] rounded-xl mt-2 overflow-hidden">
                    {REGIONS.map((reg) => (
                      <Pressable
                        key={reg}
                        onPress={() => {
                          setRegion(reg);
                          setShowRegionPicker(false);
                        }}
                        className="px-4 py-3 border-b border-[#1a1f3a] last:border-b-0">
                        <Text className={`text-base ${region === reg ? 'text-[#22c55e] font-semibold' : 'text-white'}`}>
                          {reg}
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
                    {salesman ? 'Update Salesman' : 'Add Salesman'}
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

