import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.methods.generateToken = function() {
  return jwt.sign({ id: this._id }, 'your-secret-key', { expiresIn: '1h' });
};

export const User = mongoose.model('User', userSchema);

// For demo purposes only - you should remove this in production
export const initializeDefaultUser = async () => {
  try {
    const existingUser = await User.findOne({ email: 'demo@example.com' });
    if (!existingUser) {
      await User.create({
        email: 'demo@example.com',
        password: 'password123'
      });
    }
  } catch (error) {
    console.error('Error initializing default user:', error);
  }
};