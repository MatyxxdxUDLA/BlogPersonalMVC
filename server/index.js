import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { authController } from './controllers/authController.js';
import { postController } from './controllers/postController.js';
import { auth } from './middleware/auth.js';
import { initializeDefaultUser } from './models/User.js';

dotenv.config();
// Configuración de la base de datos

const app = express();
const PORT = process.env.PORT || 3000;

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MongoDB URI is not defined in the environment variables');
  process.exit(1);
}

// Conexión a MongoDB Atlas
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    initializeDefaultUser();
  })
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

// Rutas Auth
app.post('/api/login', authController.login);

// Rutas Blog
app.post('/api/posts', auth, postController.create);
app.get('/api/posts', auth, postController.getAll);
app.put('/api/posts/:id', auth, postController.update);
app.delete('/api/posts/:id', auth, postController.delete);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});