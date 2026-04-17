import User from '../Models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Cookie set karne ka naya function
const generateTokenAndSetCookie = (res, id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.cookie('jwt', token, {
    httpOnly: true, // XSS attacks se bachata hai (JS cannot access)
    secure:true, // Production me sirf HTTPS par chalega
    sameSite: 'none', // CSRF attacks se bachata hai
    maxAge: 7 * 24 * 60 * 60 * 1000, // 30 days
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


export const getUserData = async (req, res) => {
    try {
       const userId = req.user.id;

         const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error("Error fetching user data:", error.message);
        res.status(500).json({ message: 'Server error while fetching user data' });
    }
};


export const logoutUser = async (req, res) => {
  try {
    // Cookie clear karte waqt vahi options dena zaroori hai jo set karte waqt diye the
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: true,      // Production mein hamesha true
      sameSite: 'none',  // 'lax' ki jagah 'none' karo, warna cookie delete nahi hogi
    });

    res.status(200).json({ 
      success: true, 
      message: 'Logged out successfully, cookie cleared!' 
    });
  } catch (error) {
    console.error("Logout Error:", error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during logout' 
    });
  }
};
// export const logoutUser = async (req, res) => {
//   try {
//     // res.clearCookie seedha 'jwt' naam ki cookie ko delete kar dega
//     res.clearCookie('jwt', {
//       httpOnly: true,
//       secure: true,
//       sameSite: 'lax',
//     });

//     res.status(200).json({ 
//       success: true, 
//       message: 'Logged out successfully, cookie cleared!' 
//     });
//   } catch (error) {
//     console.error("Logout Error:", error.message);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error during logout' 
//     });
//   }
// };
