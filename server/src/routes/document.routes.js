const express = require('express');
const router = express.Router();
const documentController = require('../controllers/document.controller');
const { protect } = require('../middleware/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');

// Protect all document routes
router.use(protect);

router.post('/', asyncHandler(documentController.createDocument));
router.get('/', asyncHandler(documentController.getDocuments));
router.get('/:id', asyncHandler(documentController.getDocumentById));
router.patch('/:id/status', asyncHandler(documentController.updateDocumentStatus));
router.delete('/:id', asyncHandler(documentController.deleteDocument));

module.exports = router;