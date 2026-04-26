const queryService = require('../services/query.service');
const logger = require('../config/logger');

const handleQuery = async (req, res) => {
  const { query, options } = req.body;
  const userId = req.user.id;

  // Initial bounds check verifying valid strings and resolving whitespace arrays
  if (!query || typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({
      success: false,
      message: "Query execution failed",
      error: "Query text cannot be empty or invalid"
    });
  }

  const safeQuery = query.trim();

  // Query length limits actively truncating massive API DOS payloads over constraints
  if (safeQuery.length > 1000) {
    return res.status(400).json({
      success: false,
      message: "Query execution failed",
      error: "Query is too long"
    });
  }

  try {
    const result = await queryService.processQuery(safeQuery, options, userId);
    
    return res.status(200).json({
      success: true,
      data: result,
      message: "Query successful"
    });
  } catch (error) {
    logger.error(`Controller Error explicitly failing Query boundaries: ${error.message}`);
    
    return res.status(500).json({
      success: false,
      message: "Query execution failed",
      error: error.message || "Internal Server Error"
    });
  }
};

module.exports = {
  handleQuery
};
