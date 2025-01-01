import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile_number: { type: String, required: true },
  password_hash: { type: String, required: true },
  role: [{ type: String, enum: ['chef', 'rider', 'customer'], required: true }],
  gender: { type: String, enum: ['male', 'female', 'Other'] },
  profile_image: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  address_line_1: { type: String },
  address_line_2: { type: String },
  city: { type: String },
  province: { type: String },
  postal_code: { type: String },
  country: { type: String },
  nearby_landmark: { type: String },
  created_at: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', UserSchema);