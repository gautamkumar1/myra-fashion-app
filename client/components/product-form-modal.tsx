import { View, Text, TextInput, Pressable, ScrollView, Modal, Alert, ActivityIndicator, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { createProduct, editProduct, type Product, type CreateProductData } from '@/utils/api';
import { useAuthStore } from '@/store/authStore';

interface ProductFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: Product | null;
}

const COMPANIES = ['Myra Fashion LLC', 'Sameera Star Fashion LLC'];
const STATUSES = ['active', 'inactive'];

export default function ProductFormModal({ visible, onClose, onSuccess, product }: ProductFormModalProps) {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [productName, setProductName] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [brand, setBrand] = useState('');
  const [company, setCompany] = useState('Myra Fashion LLC');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [photo, setPhoto] = useState<{ uri: string; type: string; name: string } | null>(null);
  const [existingPhoto, setExistingPhoto] = useState<{ url: string } | null>(null);
  const [showCompanyPicker, setShowCompanyPicker] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);

  useEffect(() => {
    if (product) {
      setProductName(product.productName);
      setModelNumber(product.modelNumber);
      setBrand(product.brand);
      setCompany(product.company || 'Myra Fashion LLC');
      setDescription(product.description || '');
      setStatus(product.status || 'active');
      setPrice(product.price?.toString() || '');
      setStock(product.stock?.toString() || '');
      // Store existing photo separately for display (use first photo if available)
      setExistingPhoto(product.photos && product.photos.length > 0 ? product.photos[0] : null);
      // Clear new photo when editing
      setPhoto(null);
    } else {
      // Reset form for new product
      setProductName('');
      setModelNumber('');
      setBrand('');
      setCompany('Myra Fashion LLC');
      setDescription('');
      setStatus('active');
      setPrice('');
      setStock('');
      setPhoto(null);
      setExistingPhoto(null);
    }
  }, [product, visible]);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'We need access to your photos to upload product image.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        quality: 0.8,
        allowsEditing: false,
        base64: true, // Get base64 for reliable upload
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        setPhoto({
          uri: selectedAsset.uri,
          type: 'image/jpeg',
          name: `photo_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`,
          base64: selectedAsset.base64 || undefined, // Include base64 if available
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const removePhoto = () => {
    setPhoto(null);
  };

  const handleSubmit = async () => {
    if (!productName.trim() || !modelNumber.trim() || !brand.trim() || !price.trim() || !stock.trim()) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock, 10);

    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid price.');
      return;
    }

    if (isNaN(stockNum) || stockNum < 0) {
      Alert.alert('Validation Error', 'Please enter a valid stock quantity.');
      return;
    }

    if (!token) {
      Alert.alert('Error', 'Authentication required. Please login again.');
      return;
    }

    try {
      setLoading(true);
      const productData: CreateProductData = {
        brand: brand.trim(),
        company,
        modelNumber,
        productName: productName.trim(),
        description: description.trim() || undefined,
        price: priceNum,
        stock: stockNum,
        photo: photo || undefined,
        status,
      };

      if (product) {
        await editProduct(product._id, productData, token);
        Alert.alert('Success', 'Product updated successfully!');
      } else {
        await createProduct(productData, token);
        Alert.alert('Success', 'Product created successfully!');
      }

      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save product. Please try again.';
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
          <Text className="text-white text-xl font-bold">{product ? 'Edit Product' : 'Add New Product'}</Text>
          <Pressable onPress={onClose} className="w-8 h-8 items-center justify-center">
            <Ionicons name="close" size={24} color="#ffffff" />
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
            {/* Photo Upload Area */}
            <View className="mb-6">
              <Pressable
                onPress={pickImage}
                className="border-2 border-dashed border-[#4b5563] rounded-xl p-8 items-center justify-center bg-[#2d324a]/50">
                {(photo || existingPhoto) ? (
                  <View className="relative w-full items-center">
                    {photo ? (
                      <View className="relative">
                        <Image source={{ uri: photo.uri }} className="w-48 h-48 rounded-lg" />
                        <Pressable
                          onPress={removePhoto}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full items-center justify-center">
                          <Ionicons name="close" size={16} color="#ffffff" />
                        </Pressable>
                      </View>
                    ) : existingPhoto ? (
                      <View className="relative">
                        <Image source={{ uri: existingPhoto.url }} className="w-48 h-48 rounded-lg" />
                        <View className="absolute inset-0 bg-black/30 rounded-lg items-center justify-center">
                          <Text className="text-white text-sm font-semibold">Existing Photo</Text>
                        </View>
                      </View>
                    ) : null}
                    <Pressable
                      onPress={pickImage}
                      className="mt-4 px-4 py-2 bg-[#2d324a] rounded-lg border border-[#4b5563]">
                      <Text className="text-white text-sm">Change Photo</Text>
                    </Pressable>
                  </View>
                ) : (
                  <>
                    <Ionicons name="camera-outline" size={48} color="#9ca3af" />
                    <Text className="text-gray-400 text-sm mt-2">Tap to add product photo</Text>
                  </>
                )}
              </Pressable>
            </View>

            {/* Product Name */}
            <View className="mb-4">
              <Text className="text-white text-sm font-semibold mb-2">Product Name</Text>
              <TextInput
                className="bg-[#2d324a] text-white rounded-xl px-4 py-4 text-base"
                value={productName}
                onChangeText={setProductName}
                placeholder="e.g., Banarasi Silk Saree"
                placeholderTextColor="#6b7280"
              />
            </View>

            {/* Model Number */}
            <View className="mb-4">
              <Text className="text-white text-sm font-semibold mb-2">Model Number</Text>
              <TextInput
                className="bg-[#2d324a] text-white rounded-xl px-4 py-4 text-base"
                value={modelNumber}
                onChangeText={setModelNumber}
                placeholder="e.g., SAR-SLK-001"
                placeholderTextColor="#6b7280"
                autoCapitalize="characters"
              />
            </View>

            {/* Brand */}
            <View className="mb-4">
              <Text className="text-white text-sm font-semibold mb-2">Brand</Text>
              <TextInput
                className="bg-[#2d324a] text-white rounded-xl px-4 py-4 text-base"
                value={brand}
                onChangeText={setBrand}
                placeholder="e.g., Mysore Silks"
                placeholderTextColor="#6b7280"
              />
            </View>

            {/* Company */}
            <View className="mb-4">
              <Text className="text-white text-sm font-semibold mb-2">Company</Text>
              <Pressable
                onPress={() => {
                  setShowCompanyPicker(!showCompanyPicker);
                  setShowStatusPicker(false);
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

            {/* Description */}
            <View className="mb-4">
              <Text className="text-white text-sm font-semibold mb-2">Description</Text>
              <TextInput
                className="bg-[#2d324a] text-white rounded-xl px-4 py-4 text-base"
                value={description}
                onChangeText={setDescription}
                placeholder="Enter product description (optional)"
                placeholderTextColor="#6b7280"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Status */}
            <View className="mb-4">
              <Text className="text-white text-sm font-semibold mb-2">Status</Text>
              <Pressable
                onPress={() => {
                  setShowStatusPicker(!showStatusPicker);
                  setShowCompanyPicker(false);
                }}
                className="bg-[#2d324a] rounded-xl px-4 py-4 flex-row items-center justify-between">
                <Text className="text-white text-base capitalize">{status}</Text>
                <Ionicons name="chevron-down" size={20} color="#9ca3af" />
              </Pressable>
              {showStatusPicker && (
                <View className="bg-[#2d324a] rounded-xl mt-2 overflow-hidden">
                  {STATUSES.map((stat) => (
                    <Pressable
                      key={stat}
                      onPress={() => {
                        setStatus(stat as 'active' | 'inactive');
                        setShowStatusPicker(false);
                      }}
                      className="px-4 py-3 border-b border-[#1a1f3a] last:border-b-0">
                      <Text className={`text-base capitalize ${status === stat ? 'text-[#22c55e] font-semibold' : 'text-white'}`}>
                        {stat}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* Price */}
            <View className="mb-4">
              <Text className="text-white text-sm font-semibold mb-2">Price (INR)</Text>
              <TextInput
                className="bg-[#2d324a] text-white rounded-xl px-4 py-4 text-base"
                value={price}
                onChangeText={setPrice}
                placeholder="e.g., 8999"
                placeholderTextColor="#6b7280"
                keyboardType="numeric"
              />
            </View>

            {/* Initial Stock */}
            <View className="mb-6">
              <Text className="text-white text-sm font-semibold mb-2">Initial Stock</Text>
              <TextInput
                className="bg-[#2d324a] text-white rounded-xl px-4 py-4 text-base"
                value={stock}
                onChangeText={setStock}
                placeholder="e.g., 50"
                placeholderTextColor="#6b7280"
                keyboardType="numeric"
              />
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
                  {product ? 'Update Product' : 'Create Product'}
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


