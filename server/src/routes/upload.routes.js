const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const uploadMiddleware = require('../middleware/upload.middleware');

const asyncHandler = require('../utils/asyncHandler');
const multer = require('multer');

const { protect } = require('../middleware/auth.middleware');
router.use(protect);

router.post('/', (req, res, next) => {
  uploadMiddleware.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: "Upload failed",
          error: "File is too large. Limit is 10MB."
        });
      }
      return res.status(400).json({
        success: false,
        message: "Upload failed",
        error: err.message
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: "Upload failed",
        error: err.message
      });
    }
    next();
  });
}, asyncHandler(uploadController.handleUpload));

module.exports = router;
