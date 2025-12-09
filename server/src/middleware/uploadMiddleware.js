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

// Middleware for single image upload
export const uploadSingleImage = upload.single('photo');

