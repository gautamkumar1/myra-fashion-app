import bcrypt from 'bcrypt';
import { Readable } from 'stream';
import Admin from '../models/adminModel.js';
import Salesman from '../models/salesmanModel.js';
import Warehouse from '../models/warehouseModel.js';
import Product from '../models/productModel.js';
import generateRandomPassword from '../utils/passwordGenerator.js';
import generateToken from '../utils/generateToken.js';
import cloudinary from '../utils/cloudinary.js';

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(admin._id.toString(), 'admin');

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      admin: {
        id: admin._id,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


export const createSalesman = async (req, res) => {
  try {
    const { name, email,branch,plainPassword } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name, email are required'
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    const existingUser = await Salesman.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const lastUser = await Salesman.findOne().sort({ id: -1 });
    const nextId = lastUser ? lastUser.id + 1 : 1;

    const randomPassword = generateRandomPassword(10);
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(randomPassword, saltRounds);

    const user = new Salesman({
      id: nextId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      plainPassword:randomPassword,
      branch: branch,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        branch: user.branch,
        password: randomPassword,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const createWarehouse = async (req, res) => {
  try {
    const { name, email,branch,plainPassword } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name, email are required'
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    const existingUser = await Warehouse.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const lastUser = await Warehouse.findOne().sort({ id: -1 });
    const nextId = lastUser ? lastUser.id + 1 : 1;

    const randomPassword = generateRandomPassword(10);
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(randomPassword, saltRounds);

    const user = new Warehouse({
      id: nextId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      plainPassword:randomPassword,
      branch: branch,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        branch: user.branch,
        password: randomPassword,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Helper function to upload image to Cloudinary from buffer
const uploadImageToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: 'myra-fashion/products', // Optional: organize images in folders
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    // Convert buffer to stream
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
};

export const createProduct = async (req, res) => {
  try {
    const {
      brand,
      company,
      modelNumber,
      productName,
      description,
      category,
      color,
      size,
      others,
      status,
    } = req.body;

    // Validate required fields
    if (!brand || !modelNumber || !productName) {
      return res.status(400).json({
        success: false,
        message: 'Brand, model number, and product name are required',
      });
    }

    // Check if model number already exists
    const existingProduct = await Product.findOne({
      modelNumber: modelNumber.toUpperCase().trim(),
    });

    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: 'Product with this model number already exists',
      });
    }

    // Upload images to Cloudinary if provided
    const photos = [];
    if (req.files && req.files.length > 0) {
      try {
        for (const file of req.files) {
          const imageUrl = await uploadImageToCloudinary(file.buffer);
          photos.push({ url: imageUrl });
        }
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload images to Cloudinary',
        });
      }
    }

    // Parse others if it's a string
    let parsedOthers = {};
    if (others) {
      try {
        parsedOthers = typeof others === 'string' ? JSON.parse(others) : others;
      } catch (parseError) {
        parsedOthers = {};
      }
    }

    // Create product
    const product = new Product({
      brand: brand.trim(),
      company: company || 'Myra Fashion LLC',
      modelNumber: modelNumber.toUpperCase().trim(),
      productName: productName.trim(),
      description: description ? description.trim() : '',
      photos: photos,
      category: category ? category.trim() : undefined,
      attributes: {
        color: color ? color.trim() : undefined,
        size: size ? size.trim() : undefined,
        others: Object.keys(parsedOthers).length > 0 ? parsedOthers : undefined,
      },
      status: status || 'active',
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: product,
    });
  } catch (error) {
    console.error('Create product error:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Product with this model number already exists',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      brand,
      company,
      modelNumber,
      productName,
      description,
      category,
      color,
      size,
      others,
      status,
    } = req.body;

    // Find product by ID
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if model number is being changed and if it already exists
    if (modelNumber && modelNumber.toUpperCase().trim() !== product.modelNumber) {
      const existingProduct = await Product.findOne({
        modelNumber: modelNumber.toUpperCase().trim(),
        _id: { $ne: id },
      });

      if (existingProduct) {
        return res.status(409).json({
          success: false,
          message: 'Product with this model number already exists',
        });
      }
    }

    // Upload new images to Cloudinary if provided
    const newPhotos = [];
    if (req.files && req.files.length > 0) {
      try {
        for (const file of req.files) {
          const imageUrl = await uploadImageToCloudinary(file.buffer);
          newPhotos.push({ url: imageUrl });
        }
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload images to Cloudinary',
        });
      }
    }

    // Update product fields (partial update)
    if (brand !== undefined) product.brand = brand.trim();
    if (company !== undefined) product.company = company;
    if (modelNumber !== undefined)
      product.modelNumber = modelNumber.toUpperCase().trim();
    if (productName !== undefined) product.productName = productName.trim();
    if (description !== undefined) product.description = description.trim();
    if (category !== undefined)
      product.category = category ? category.trim() : undefined;
    if (status !== undefined) product.status = status;

    // Update attributes
    if (color !== undefined)
      product.attributes.color = color ? color.trim() : undefined;
    if (size !== undefined)
      product.attributes.size = size ? size.trim() : undefined;
    if (others !== undefined) {
      try {
        product.attributes.others =
          typeof others === 'string' ? JSON.parse(others) : others;
      } catch (parseError) {
        // Keep existing others if parsing fails
      }
    }

    // Handle photos: if new photos provided, replace existing ones
    // Otherwise, keep existing photos
    if (newPhotos.length > 0) {
      product.photos = newPhotos;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: product,
    });
  } catch (error) {
    console.error('Edit product error:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Product with this model number already exists',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { company, status, category } = req.query;

    // Build filter object
    const filter = {};

    if (company) {
      filter.company = company;
    }

    if (status) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    // Fetch products with filters
    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      products: products,
      count: products.length,
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    // Count products
    const productsCount = await Product.countDocuments();

    // Count salesmen
    const salesmenCount = await Salesman.countDocuments();

    // Count warehouse staff
    const warehouseStaffCount = await Warehouse.countDocuments();

    // Mock pending orders count (no Order model exists yet)
    const pendingOrdersCount = 2;

    res.status(200).json({
      success: true,
      message: 'Dashboard statistics retrieved successfully',
      stats: {
        products: productsCount,
        salesmen: salesmenCount,
        warehouseStaff: warehouseStaffCount,
        pendingOrders: pendingOrdersCount,
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
