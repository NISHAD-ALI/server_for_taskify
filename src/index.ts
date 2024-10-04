import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/connectDB';
import router from './routes/routes';

dotenv.config();

const app = express();

// Database connection
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({ 
  origin: 'http://localhost:5173', // Ensure no trailing slash
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));

// Routes
app.use('/', router); 

// Start server
app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
});
