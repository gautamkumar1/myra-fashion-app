import bcrypt from 'bcrypt';
import { Readable } from 'stream';
import Admin from '../models/adminModel.js';
import Salesman from '../models/salesmanModel.js';
import Warehouse from '../models/warehouseModel.js';
import Product from '../models/productModel.js';
import generateRandomPassword from '../utils/passwordGenerator.js';
import generateToken from '../utils/generateToken.js';
import cloudinary from '../utils/cloudinary.js';

// Verify Cloudinary configuration
console.log('Cloudinary config check:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing',
  api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing',
  api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing',
});

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
    const { name, email, branch, phone, region, plainPassword } = req.body;

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
      plainPassword: randomPassword,
      branch: branch || 'Myra Fashion LLC',
      phone: phone ? phone.trim() : undefined,
      region: region || undefined,
      status: 'active',
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
        phone: user.phone,
        region: user.region,
        status: user.status,
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
    const { name, email, branch, phone, shift, warehouse, plainPassword } = req.body;

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
      plainPassword: randomPassword,
      branch: branch || 'Myra Fashion LLC',
      phone: phone ? phone.trim() : undefined,
      shift: shift || undefined,
      warehouse: warehouse || undefined,
      status: 'active',
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
        phone: user.phone,
        shift: user.shift,
        warehouse: user.warehouse,
        status: user.status,
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
    if (!buffer || !Buffer.isBuffer(buffer)) {
      reject(new Error('Invalid buffer provided'));
      return;
    }

    if (buffer.length === 0) {
      reject(new Error('Empty buffer provided'));
      return;
    }

    console.log('Uploading to Cloudinary, buffer size:', buffer.length, 'bytes');

    // Use upload_stream method (recommended for buffers)
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: 'myra-fashion/products',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error details:', {
            message: error.message,
            http_code: error.http_code,
            name: error.name,
          });
          reject(error);
        } else if (!result) {
          console.error('Cloudinary upload returned no result');
          reject(new Error('Upload failed: No result returned from Cloudinary'));
        } else if (!result.secure_url) {
          console.error('Cloudinary upload result missing secure_url. Full result:', JSON.stringify(result, null, 2));
          reject(new Error('Upload failed: secure_url not found in result'));
        } else {
          console.log('Cloudinary upload successful. URL:', result.secure_url);
          resolve(result.secure_url);
        }
      }
    );

    // Handle stream errors
    uploadStream.on('error', (error) => {
      console.error('Upload stream error:', error);
      reject(error);
    });

    // Convert buffer to stream and pipe to upload stream
    try {
      const readableStream = new Readable();
      readableStream.push(buffer);
      readableStream.push(null);
      
      readableStream.on('error', (error) => {
        console.error('Readable stream error:', error);
        reject(error);
      });

      readableStream.pipe(uploadStream);
    } catch (streamError) {
      console.error('Error creating readable stream:', streamError);
      reject(streamError);
    }
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
      price,
      stock,
    } = req.body;

    // Validate required fields
    if (!brand || !modelNumber || !productName || price === undefined || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Brand, model number, product name, price, and stock are required',
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

    // Upload image to Cloudinary if provided
    const photos = [];
    
    // Check for file from multer first
    if (req.file) {
      console.log('File received from multer:', {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        bufferLength: req.file.buffer ? req.file.buffer.length : 0,
      });
      
      try {
        const imageUrl = await uploadImageToCloudinary(req.file.buffer);
        console.log('Image uploaded successfully, URL:', imageUrl);
        photos.push({ url: imageUrl });
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: `Failed to upload image to Cloudinary: ${uploadError.message || 'Unknown error'}`,
        });
      }
    } 
    // Fallback: Check for base64 image (React Native FormData workaround)
    else if (req.body.photoBase64) {
      console.log('Base64 image received, converting to buffer...');
      try {
        // Convert base64 to buffer
        const base64Data = req.body.photoBase64.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');
        
        console.log('Base64 converted to buffer, size:', imageBuffer.length, 'bytes');
        
        const imageUrl = await uploadImageToCloudinary(imageBuffer);
        console.log('Image uploaded successfully from base64, URL:', imageUrl);
        photos.push({ url: imageUrl });
      } catch (uploadError) {
        console.error('Cloudinary upload error from base64:', uploadError);
        return res.status(500).json({
          success: false,
          message: `Failed to upload image to Cloudinary: ${uploadError.message || 'Unknown error'}`,
        });
      }
    } else {
      console.log('No file or base64 image received in request');
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
      price: parseFloat(price),
      stock: parseInt(stock, 10),
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
      price,
      stock,
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

    // Upload new image to Cloudinary if provided
    const newPhotos = [];
    
    // Check for file from multer first
    if (req.file) {
      console.log('File received for edit from multer:', {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        bufferLength: req.file.buffer ? req.file.buffer.length : 0,
      });
      
      try {
        const imageUrl = await uploadImageToCloudinary(req.file.buffer);
        console.log('Image uploaded successfully for edit, URL:', imageUrl);
        newPhotos.push({ url: imageUrl });
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: `Failed to upload image to Cloudinary: ${uploadError.message || 'Unknown error'}`,
        });
      }
    }
    // Fallback: Check for base64 image (React Native FormData workaround)
    else if (req.body.photoBase64) {
      console.log('Base64 image received for edit, converting to buffer...');
      try {
        // Convert base64 to buffer
        const base64Data = req.body.photoBase64.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');
        
        console.log('Base64 converted to buffer for edit, size:', imageBuffer.length, 'bytes');
        
        const imageUrl = await uploadImageToCloudinary(imageBuffer);
        console.log('Image uploaded successfully for edit from base64, URL:', imageUrl);
        newPhotos.push({ url: imageUrl });
      } catch (uploadError) {
        console.error('Cloudinary upload error from base64:', uploadError);
        return res.status(500).json({
          success: false,
          message: `Failed to upload image to Cloudinary: ${uploadError.message || 'Unknown error'}`,
        });
      }
    } else {
      console.log('No file or base64 image received in edit request');
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
    if (price !== undefined) product.price = parseFloat(price);
    if (stock !== undefined) product.stock = parseInt(stock, 10);

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

    // Handle photo: if new photo provided, replace existing ones
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

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);
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

export const getSalesmen = async (req, res) => {
  try {
    const salesmen = await Salesman.find().sort({ createdAt: -1 }).select('-password -plainPassword');

    res.status(200).json({
      success: true,
      message: 'Salesmen retrieved successfully',
      salesmen: salesmen,
      count: salesmen.length,
    });
  } catch (error) {
    console.error('Get salesmen error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getSalesmanDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const salesman = await Salesman.findById(id).select('-password');

    if (!salesman) {
      return res.status(404).json({
        success: false,
        message: 'Salesman not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Salesman details retrieved successfully',
      salesman: {
        _id: salesman._id,
        id: salesman.id,
        name: salesman.name,
        email: salesman.email,
        branch: salesman.branch,
        phone: salesman.phone,
        region: salesman.region,
        status: salesman.status,
        plainPassword: salesman.plainPassword,
        createdAt: salesman.createdAt,
        updatedAt: salesman.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get salesman details error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const updateSalesman = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, branch, phone, region, status } = req.body;

    const salesman = await Salesman.findById(id);

    if (!salesman) {
      return res.status(404).json({
        success: false,
        message: 'Salesman not found',
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email.toLowerCase().trim() !== salesman.email) {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address',
        });
      }

      const existingUser = await Salesman.findOne({
        email: email.toLowerCase(),
        _id: { $ne: id },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User with this email already exists',
        });
      }
    }

    // Update fields
    if (name !== undefined) salesman.name = name.trim();
    if (email !== undefined) salesman.email = email.toLowerCase().trim();
    if (branch !== undefined) salesman.branch = branch;
    if (phone !== undefined) salesman.phone = phone ? phone.trim() : undefined;
    if (region !== undefined) salesman.region = region || undefined;
    if (status !== undefined) salesman.status = status;

    await salesman.save();

    res.status(200).json({
      success: true,
      message: 'Salesman updated successfully',
      salesman: {
        id: salesman.id,
        name: salesman.name,
        email: salesman.email,
        branch: salesman.branch,
        phone: salesman.phone,
        region: salesman.region,
        status: salesman.status,
        createdAt: salesman.createdAt,
      },
    });
  } catch (error) {
    console.error('Update salesman error:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const deleteSalesman = async (req, res) => {
  try {
    const { id } = req.params;

    const salesman = await Salesman.findById(id);

    if (!salesman) {
      return res.status(404).json({
        success: false,
        message: 'Salesman not found',
      });
    }

    await Salesman.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Salesman deleted successfully',
    });
  } catch (error) {
    console.error('Delete salesman error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getWarehouseStaff = async (req, res) => {
  try {
    const warehouseStaff = await Warehouse.find().sort({ createdAt: -1 }).select('-password -plainPassword');

    res.status(200).json({
      success: true,
      message: 'Warehouse staff retrieved successfully',
      warehouseStaff: warehouseStaff,
      count: warehouseStaff.length,
    });
  } catch (error) {
    console.error('Get warehouse staff error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getWarehouseStaffDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const warehouseStaff = await Warehouse.findById(id).select('-password');

    if (!warehouseStaff) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse staff not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Warehouse staff details retrieved successfully',
      warehouseStaff: {
        _id: warehouseStaff._id,
        id: warehouseStaff.id,
        name: warehouseStaff.name,
        email: warehouseStaff.email,
        branch: warehouseStaff.branch,
        phone: warehouseStaff.phone,
        shift: warehouseStaff.shift,
        warehouse: warehouseStaff.warehouse,
        status: warehouseStaff.status,
        plainPassword: warehouseStaff.plainPassword,
        createdAt: warehouseStaff.createdAt,
        updatedAt: warehouseStaff.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get warehouse staff details error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const updateWarehouseStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, branch, phone, shift, warehouse, status } = req.body;

    const warehouseStaff = await Warehouse.findById(id);

    if (!warehouseStaff) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse staff not found',
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email.toLowerCase().trim() !== warehouseStaff.email) {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address',
        });
      }

      const existingUser = await Warehouse.findOne({
        email: email.toLowerCase(),
        _id: { $ne: id },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User with this email already exists',
        });
      }
    }

    // Update fields
    if (name !== undefined) warehouseStaff.name = name.trim();
    if (email !== undefined) warehouseStaff.email = email.toLowerCase().trim();
    if (branch !== undefined) warehouseStaff.branch = branch;
    if (phone !== undefined) warehouseStaff.phone = phone ? phone.trim() : undefined;
    if (shift !== undefined) warehouseStaff.shift = shift || undefined;
    if (warehouse !== undefined) warehouseStaff.warehouse = warehouse || undefined;
    if (status !== undefined) warehouseStaff.status = status;

    await warehouseStaff.save();

    res.status(200).json({
      success: true,
      message: 'Warehouse staff updated successfully',
      warehouseStaff: {
        _id: warehouseStaff._id,
        id: warehouseStaff.id,
        name: warehouseStaff.name,
        email: warehouseStaff.email,
        branch: warehouseStaff.branch,
        phone: warehouseStaff.phone,
        shift: warehouseStaff.shift,
        warehouse: warehouseStaff.warehouse,
        status: warehouseStaff.status,
        createdAt: warehouseStaff.createdAt,
        updatedAt: warehouseStaff.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update warehouse staff error:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const deleteWarehouseStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const warehouseStaff = await Warehouse.findById(id);

    if (!warehouseStaff) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse staff not found',
      });
    }

    await Warehouse.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Warehouse staff deleted successfully',
    });
  } catch (error) {
    console.error('Delete warehouse staff error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
