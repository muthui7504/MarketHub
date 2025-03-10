import multer from 'multer';
import path from 'path';

// Set up the storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the folder for storing uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Generate a unique file name
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File type and size limits
const fileFilter = (req, file, cb) => {
  // Define allowed file extensions
  const allowedFileTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only JPEG, JPG, PNG, and PDF formats are allowed!'), false); // Reject the file
  }
};

// Multer middleware with size and file type constraints
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // File size limit of 5MB
  fileFilter: fileFilter
});

// Middleware function for uploading images
export const uploadImages = (req, res, next) => {
  upload.array('images', 5)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Handle Multer-specific errors (e.g., file size limit)
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      // Handle other errors (e.g., invalid file type)
      return res.status(400).json({ success: false, message: err.message });
    }
    next(); // Continue to the next middleware if no errors
  });
};
