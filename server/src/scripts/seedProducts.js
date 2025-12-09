import 'dotenv/config';
import fetch from 'node-fetch';
import FormData from 'form-data';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

// Admin credentials
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = '123456';

// Dummy products with meaningful fashion data
const products = [
  {
    brand: 'Nike',
    company: 'Myra Fashion LLC',
    modelNumber: 'NK-AIR-001',
    productName: 'Nike Air Max 90 Classic',
    description: 'Classic running shoes with Air Max cushioning technology. Perfect for daily wear and light exercise.',
    category: 'Footwear',
    color: 'Black/White',
    size: '42',
    others: { material: 'Leather', gender: 'Unisex', season: 'All Season' },
    status: 'active',
  },
  {
    brand: 'Adidas',
    company: 'Myra Fashion LLC',
    modelNumber: 'AD-ORIG-002',
    productName: 'Adidas Originals Superstar',
    description: 'Iconic shell-toe design with leather upper. A timeless classic that never goes out of style.',
    category: 'Footwear',
    color: 'White/Black',
    size: '41',
    others: { material: 'Leather', gender: 'Unisex', season: 'All Season' },
    status: 'active',
  },
  {
    brand: 'Zara',
    company: 'Myra Fashion LLC',
    modelNumber: 'ZR-COTTON-003',
    productName: 'Zara Classic White T-Shirt',
    description: 'Premium cotton t-shirt with modern fit. Perfect for casual wear or layering.',
    category: 'Apparel',
    color: 'White',
    size: 'Large',
    others: { material: '100% Cotton', gender: 'Unisex', care: 'Machine Wash' },
    status: 'active',
  },
  {
    brand: 'H&M',
    company: 'Sameera Star Fashion LLC',
    modelNumber: 'HM-DENIM-004',
    productName: 'H&M Slim Fit Jeans',
    description: 'Comfortable slim-fit jeans with stretch fabric. Modern cut for everyday wear.',
    category: 'Apparel',
    color: 'Blue',
    size: '32',
    others: { material: '98% Cotton, 2% Elastane', gender: 'Men', fit: 'Slim' },
    status: 'active',
  },
  {
    brand: 'Levi\'s',
    company: 'Myra Fashion LLC',
    modelNumber: 'LV-501-005',
    productName: 'Levi\'s 501 Original Jeans',
    description: 'The original straight-leg jeans. Iconic 501 fit with button fly and classic styling.',
    category: 'Apparel',
    color: 'Indigo',
    size: '34',
    others: { material: '100% Cotton', gender: 'Men', fit: 'Straight' },
    status: 'active',
  },
  {
    brand: 'Puma',
    company: 'Myra Fashion LLC',
    modelNumber: 'PM-SUEDE-006',
    productName: 'Puma Suede Classic',
    description: 'Classic suede sneakers with timeless design. Comfortable and stylish for everyday wear.',
    category: 'Footwear',
    color: 'Black',
    size: '43',
    others: { material: 'Suede', gender: 'Unisex', season: 'All Season' },
    status: 'active',
  },
  {
    brand: 'Uniqlo',
    company: 'Sameera Star Fashion LLC',
    modelNumber: 'UQ-FLEECE-007',
    productName: 'Uniqlo Fleece Jacket',
    description: 'Lightweight fleece jacket perfect for layering. Soft and comfortable with modern design.',
    category: 'Outerwear',
    color: 'Navy',
    size: 'Medium',
    others: { material: 'Polyester', gender: 'Unisex', season: 'Fall/Winter' },
    status: 'active',
  },
  {
    brand: 'Gap',
    company: 'Myra Fashion LLC',
    modelNumber: 'GP-HOODIE-008',
    productName: 'Gap Classic Hoodie',
    description: 'Cozy cotton hoodie with drawstring hood. Perfect for casual comfort and style.',
    category: 'Apparel',
    color: 'Gray',
    size: 'Large',
    others: { material: '80% Cotton, 20% Polyester', gender: 'Unisex', season: 'All Season' },
    status: 'active',
  },
  {
    brand: 'Converse',
    company: 'Myra Fashion LLC',
    modelNumber: 'CV-CHUCK-009',
    productName: 'Converse Chuck Taylor All Star',
    description: 'The original high-top canvas sneaker. Iconic design that has stood the test of time.',
    category: 'Footwear',
    color: 'White',
    size: '40',
    others: { material: 'Canvas', gender: 'Unisex', season: 'All Season' },
    status: 'active',
  },
  {
    brand: 'Calvin Klein',
    company: 'Sameera Star Fashion LLC',
    modelNumber: 'CK-UNDER-010',
    productName: 'Calvin Klein Underwear Pack',
    description: 'Premium cotton underwear set. Comfortable and durable with modern design.',
    category: 'Underwear',
    color: 'Black',
    size: 'Medium',
    others: { material: 'Cotton', gender: 'Men', pack: '3-Pack' },
    status: 'active',
  },
];

async function loginAdmin() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
    });

    const data = await response.json();
    
    if (!data.success || !data.token) {
      throw new Error(data.message || 'Failed to login');
    }

    return data.token;
  } catch (error) {
    console.error('Login error:', error.message);
    throw error;
  }
}

async function createProduct(token, productData) {
  try {
    const formData = new FormData();
    
    // Add all product fields to form data
    Object.keys(productData).forEach((key) => {
      if (key !== 'others') {
        formData.append(key, productData[key]);
      } else {
        // Stringify the others object
        formData.append(key, JSON.stringify(productData[key]));
      }
    });

    const response = await fetch(`${API_BASE_URL}/admin/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...formData.getHeaders(),
      },
      body: formData,
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to create product');
    }

    return data.product;
  } catch (error) {
    console.error('Create product error:', error.message);
    throw error;
  }
}

async function seedProducts() {
  try {
    console.log('Logging in as admin...');
    const token = await loginAdmin();
    console.log('✓ Login successful\n');

    console.log('Creating products...\n');
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      try {
        console.log(`[${i + 1}/${products.length}] Creating: ${product.productName} (${product.modelNumber})...`);
        const createdProduct = await createProduct(token, product);
        console.log(`✓ Created successfully: ${createdProduct.productName}\n`);
      } catch (error) {
        console.error(`✗ Failed to create ${product.productName}: ${error.message}\n`);
      }
    }

    console.log('Product seeding completed!');
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
}

// Run the seeding
seedProducts();

