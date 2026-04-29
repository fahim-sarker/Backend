// controllers/authController.js

const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../middleware/asyncHandler");

// ─── @desc    Register new user
// ─── @route   POST /api/auth/register
// ─── @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // ── Validate input ──
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide name, email and password");
  }

  // ── Check if user already exists ──
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User with this email already exists");
  }

  // ── Create user ──
  // Password is automatically hashed by the pre-save hook in User model
  const user = await User.create({ name, email, password });

  if (user) {
    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id), // send token immediately — user is logged in
      },
    });
  } else {
    res.status(400);
    throw new Error("Failed to create user — invalid data");
  }
});

// ─── @desc    Login user
// ─── @route   POST /api/auth/login
// ─── @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // ── Validate input ──
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  // ── Find user by email ──
  // We use .select('+password') because password has select:false in schema
  // This is the ONLY place we ever retrieve the password field
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // ── Check if account is active ──
  if (!user.isActive) {
    res.status(401);
    throw new Error("Your account has been deactivated — contact support");
  }

  // ── Compare entered password with hashed password ──
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // ── Return user data + token ──
  res.json({
    success: true,
    message: "Login successful",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token: generateToken(user._id),
    },
  });
});

// ─── @desc    Get logged-in user profile
// ─── @route   GET /api/auth/profile
// ─── @access  Private (requires token)
const getUserProfile = asyncHandler(async (req, res) => {
  // req.user is set by the protect middleware
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      avatar: user.avatar,
      wishlist: user.wishlist,
      createdAt: user.createdAt,
    },
  });
});

// ─── @desc    Update logged-in user profile
// ─── @route   PUT /api/auth/profile
// ─── @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Only update fields that were sent
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.phone = req.body.phone || user.phone;
  user.address = req.body.address || user.address;

  // Only update password if a new one was provided
  if (req.body.password) {
    user.password = req.body.password; // pre-save hook will hash it
  }

  const updatedUser = await user.save();

  res.json({
    success: true,
    message: "Profile updated successfully",
    data: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      address: updatedUser.address,
      token: generateToken(updatedUser._id),
    },
  });
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
