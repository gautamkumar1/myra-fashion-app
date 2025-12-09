import multer from 'multer';

// Configure multer to use memory storage (for Cloudinary streaming)
const storage = multer.memoryStorage();

// File filter to only accept images
const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Configure multer with limits
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
  },
});

// Middleware for multiple image uploads
export const uploadMultipleImages = upload.array('photos', 10); // Max 10 images

// Middleware for single image upload with error handling
export const uploadSingleImage = (req, res, next) => {
  upload.single('photo')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({
        success: false,
        message: `File upload error: ${err.message}`,
      });
    }
    
    // Log what multer received
    console.log('Multer processed request:');
    console.log('- req.file:', req.file ? 'Present' : 'Missing');
    console.log('- req.body keys:', Object.keys(req.body));
    
    if (req.file) {
      console.log('- File details:', {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        encoding: req.file.encoding,
        mimetype: req.file.mimetype,
        size: req.file.size,
        bufferLength: req.file.buffer ? req.file.buffer.length : 0,
      });
    } else {
      console.log('- No file received by multer');
      console.log('- Request headers:', req.headers);
      console.log('- Content-Type:', req.headers['content-type']);
    }
    
    next();
  });
};

