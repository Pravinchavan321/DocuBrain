const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Session = require('../models/session.model');
const { JWT_SECRET, JWT_REFRESH_SECRET } = require('../config/env');
const logger = require('../config/logger');

const SALT_ROUNDS = 12;
const ACCESS_TOKEN_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';
const REFRESH_TOKEN_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';

/**
 * Generate Access Token
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
    },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

/**
 * Generate Refresh Token
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
};

/**
 * Register a new user
 */
const registerUser = async (email, password, full_name) => {
  // 1. Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('User with this email already exists');
    error.statusCode = 400;
    throw error;
  }

  // 2. Hash password
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  // 3. Create user
  const user = await User.create({
    email,
    password_hash,
    full_name
  });

  return user;
};

/**
 * Login user
 */
const loginUser = async (email, password) => {
  // 1. Find user
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // 2. Generate tokens
  const access_token = generateAccessToken(user);
  const refresh_token = generateRefreshToken(user);

  // 3. Manage Sessions
  // Delete all old sessions for this user
  await Session.deleteMany({ userId: user._id });

  // Insert new session
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

  await Session.create({
    userId: user._id,
    refresh_token,
    expiresAt
  });

  // 4. Return tokens and user
  return {
    access_token,
    refresh_token,
    user: {
      id: user._id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
    },
  };
};

/**
 * Refresh access token
 */
const refreshAccessToken = async (refresh_token) => {
  // 1. Verify Refresh Token
  let decoded;
  try {
    decoded = jwt.verify(refresh_token, JWT_REFRESH_SECRET);
  } catch (err) {
    const error = new Error('Invalid refresh token');
    error.statusCode = 401;
    throw error;
  }

  // 2. Check session in DB
  const session = await Session.findOne({ refresh_token }).populate('userId');

  if (!session || session.expiresAt < new Date()) {
    const error = new Error('Session expired or invalid');
    error.statusCode = 401;
    throw error;
  }

  const user = session.userId;

  // 3. Issue new access token only
  const access_token = generateAccessToken(user);

  return { access_token };
};

/**
 * Logout user
 */
const logoutUser = async (refresh_token) => {
  await Session.deleteOne({ refresh_token });
  return true;
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
};
