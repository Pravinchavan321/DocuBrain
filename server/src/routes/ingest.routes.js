const express = require('express');
const router = express.Router();
const ingestController = require('../controllers/ingest.controller');
const { protect } = require('../middleware/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');

router.use(protect);

router.post('/:documentId', asyncHandler(ingestController.triggerIngest));
router.get('/:documentId/status', asyncHandler(ingestController.getIngestStatus));

module.exports = router;
