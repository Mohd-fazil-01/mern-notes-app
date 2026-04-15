import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Cookie set karne ka naya function
const generateTokenAndSetCookie = (res, id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

  res.cookie('jwt', token, {
    httpOnly: true, // XSS attacks se bachata hai (JS cannot access)
    secure: process.env.NODE_ENV === 'production', // Production me sirf HTTPS par chalega
    sameSite: 'strict', // CSRF attacks se bachata hai
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });

    if (user) {
      // Token ab cookie mein jayega
      generateTokenAndSetCookie(res, user._id);
      
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        message: 'Registration successful' // Token JSON mein bhejne ki zaroorat nahi
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    const isPasswordMatch = user ? await bcrypt.compare(password, user.password) : false;

    if (user && isPasswordMatch) {
      // Token ab cookie mein jayega
      generateTokenAndSetCookie(res, user._id);

      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        message: 'Login successful'
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};