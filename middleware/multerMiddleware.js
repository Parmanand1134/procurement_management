const multer = require('multer');
const path = require('path');

// Set up multer storage options
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Directory for storing uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Filename format
    }
});

// Create multer instance
const upload = multer({ storage });

// Export the upload middleware for handling multiple files
const uploadMiddleware = upload.array('images'); // Adjust 'images' based on your form field name

module.exports = uploadMiddleware;
