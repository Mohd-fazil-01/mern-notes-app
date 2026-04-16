import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // <-- 1. Import kiya
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import noteRoutes from "./routes/noteRoutes.js"

dotenv.config();
connectDB();

const app = express();

// 2. CORS update for Cookies (Frontend URL yahan aayega)
app.use(cors({
  origin: 'http://localhost:5173', // Exact frontend URL
  credentials: true,               // Cookies ke liye zaroori
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());
app.use(cookieParser()); // <-- 3. Middleware use kiya

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));