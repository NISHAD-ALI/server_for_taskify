import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/connectDB';
import router from './routes/routes';

dotenv.config();

const app = express();


connectDB();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ 
  origin: 'https://taskifyco.vercel.app/', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true 
}));


app.use('/', router); 

app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
});
