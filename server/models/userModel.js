import { genSalt } from 'bcryptjs';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['User', 'Admin'], // Defines possible roles
    default: 'User'        
  }
});
userSchema.pre("save", async function (next) {
  const salt = await genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model('User', userSchema);