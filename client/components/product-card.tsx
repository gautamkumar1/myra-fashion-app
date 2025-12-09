import { View, Text, Pressable, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type Product } from '@/utils/api';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

function getStatusBadge(stock: number | undefined, status: string) {
  const stockValue = stock ?? 0;
  if (status === 'inactive' || stockValue === 0) {
    return { label: 'Inactive', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.2)' };
  }
  if (stockValue < 10) {
    return { label: 'Low Stock', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.2)' };
  }
  return { label: 'Active', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.2)' };
}

function formatPrice(price: number | undefined): string {
  if (price === undefined || price === null) {
    return '₹0';
  }
  return `₹${price.toLocaleString('en-IN')}`;
}

export default function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const statusBadge = getStatusBadge(product.stock ?? 0, product.status);
  const productImage = product.photos && product.photos.length > 0 ? product.photos[0].url : null;
  const stockValue = product.stock ?? 0;

  return (
    <View className="bg-[#2d324a] rounded-xl p-4 mb-3 flex-row">
      {/* Product Image */}
      <View className="w-20 h-20 rounded-lg overflow-hidden mr-4 bg-[#1a1f3a]">
        {productImage ? (
          <Image source={{ uri: productImage }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <View className="w-full h-full items-center justify-center">
            <Ionicons name="image-outline" size={32} color="#6b7280" />
          </View>
        )}
      </View>

      {/* Product Details */}
      <View className="flex-1">
        <Text className="text-gray-400 text-xs mb-1">{product.modelNumber}</Text>
        <Text className="text-white text-base font-bold mb-1">{product.productName}</Text>
        <Text className="text-gray-400 text-sm mb-2">{product.brand}</Text>
        
        <View className="flex-row items-center justify-between mt-2">
          <View>
            <Text className="text-[#22c55e] text-base font-semibold">{formatPrice(product.price)}</Text>
            <Text className="text-gray-400 text-xs mt-1">{stockValue} in stock</Text>
          </View>
          
          {/* Status Badge */}
          <View
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: statusBadge.bgColor }}>
            <Text className="text-xs font-semibold" style={{ color: statusBadge.color }}>
              {statusBadge.label}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row items-center ml-2">
        <TouchableOpacity
          onPress={() => onEdit(product)}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="w-10 h-10 items-center justify-center mr-2">
          <View 
            className="w-8 h-8 bg-[#2d324a] rounded items-center justify-center border border-[#4b5563]"
            pointerEvents="box-none">
            <Ionicons name="pencil" size={16} color="#9ca3af" />
          </View>
        </TouchableOpacity>
        <Pressable
          onPress={() => {
            console.log('Delete button pressed, product ID:', product._id);
            onDelete(product._id);
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{ zIndex: 10, elevation: 10 }}
          className="w-10 h-10 items-center justify-center">
          {({ pressed }) => (
            <View 
              className={`w-8 h-8 bg-[#2d324a] rounded items-center justify-center border border-[#4b5563] ${pressed ? 'opacity-70' : ''}`}
              pointerEvents="box-none">
              <Ionicons name="trash-outline" size={16} color="#ef4444" />
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

