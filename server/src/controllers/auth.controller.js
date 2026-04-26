const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { email, password, full_name } = req.body;
  const user = await authService.registerUser(email, password, full_name);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: { user_id: user.id },
  });
});

/**
 * @desc    Log in user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const data = await authService.loginUser(email, password);

  res.status(200).json({
    success: true,
    data,
  });
});

/**
 * @desc    Refresh access token
 * @route   POST /api/v1/auth/refresh
 * @access  Public
 */
const refresh = asyncHandler(async (req, res) => {
  const { refresh_token } = req.body;
  
  if (!refresh_token) {
    return res.status(400).json({
      success: false,
      message: 'Refresh token is required',
      error: 'RefreshTokenMissing',
    });
  }

  const data = await authService.refreshAccessToken(refresh_token);

  res.status(200).json({
    success: true,
    data,
  });
});

/**
 * @desc    Log out user
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).json({
      success: false,
      message: 'Refresh token is required for logout',
      error: 'RefreshTokenMissing',
    });
  }

  await authService.logoutUser(refresh_token);

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * @desc    Get current user profile
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user
    },
  });
});

module.exports = {
  register,
  login,
  refresh,
  logout,
  getMe,
};
