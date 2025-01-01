import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema({
  chef_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef', required: true },
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  review: { type: String },
  created_at: { type: Date, default: Date.now }
});

export const Rating = mongoose.model('Rating', RatingSchema);