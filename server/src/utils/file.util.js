const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ensureUploadDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const generateSafeFilename = (file) => {
  const timestamp = Date.now();
  const randomStr = crypto.randomBytes(4).toString('hex');
  const ext = path.extname(file.originalname);
  return `${timestamp}-${randomStr}${ext}`;
};

const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase();
};

module.exports = {
  ensureUploadDir,
  generateSafeFilename,
  getFileExtension
};
