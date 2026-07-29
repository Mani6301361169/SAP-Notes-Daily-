const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/authMiddleware');

// Login User or Admin
exports.login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Password incorrect.' });
    }

    if (typeof rememberMe === 'boolean') {
      user.rememberMe = rememberMe;
      await user.save();
    }

    const expiresIn = rememberMe ? '30d' : '24h';
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn }
    );

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        rememberMe: user.rememberMe
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'user',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`
    });

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role, email: newUser.email, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Forgot Password Mock/Reset
exports.forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email address is required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: 'User with specified email address not found.' });
    }

    if (newPassword) {
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
      return res.json({ message: 'Password reset successfully. You can now log in with your new password.' });
    }

    return res.json({ message: 'Password reset link sent to registered email address.' });
  } catch (error) {
    return res.status(500).json({ message: 'Forgot password request failed', error: error.message });
  }
};

// Get current user profile
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving user', error: error.message });
  }
};
