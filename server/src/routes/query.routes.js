const express = require('express');
const router = express.Router();
const queryController = require('../controllers/query.controller');
const { protect } = require('../middleware/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');

router.use(protect);

router.post('/', asyncHandler(queryController.handleQuery));

module.exports = router;
