import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON

// --- Static File Serving ---
const __dirname = path.resolve();
const uploadsPath = path.join(__dirname, 'uploads');
const publicPath = path.join(__dirname, 'public');

// Ensure uploads folder exists
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });

// Ensure public folder exists (for favicon)
if (!fs.existsSync(publicPath)) fs.mkdirSync(publicPath, { recursive: true });

console.log('Serving uploads from:', uploadsPath);
console.log('Files in uploads:', fs.readdirSync(uploadsPath));

// Serve uploads folder statically
app.use('/uploads', express.static(uploadsPath));

// Serve public folder statically (for favicon or other assets)
app.use(express.static(publicPath));

// --- Favicon ---
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(publicPath, 'favicon.ico'));
});

// --- API Routes ---
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

// --- Error Handling Middleware ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
