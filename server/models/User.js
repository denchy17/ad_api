import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  telegram_username: { type: String, default: 'none' },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false }
});

export default mongoose.model('User', userSchema);
