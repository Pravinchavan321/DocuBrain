const multer = require('multer');
const path = require('path');
const { ensureUploadDir, generateSafeFilename, getFileExtension } = require('../utils/file.util');

const uploadDir = path.join(__dirname, '../../uploads');
ensureUploadDir(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadDir(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, generateSafeFilename(file));
  }
});

const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'];

const fileFilter = (req, file, cb) => {
  const ext = getFileExtension(file.originalname);
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only .pdf, .doc, .docx, and .txt are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB maximum
  }
});

module.exports = upload;
