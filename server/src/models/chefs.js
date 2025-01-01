import mongoose from "mongoose";

const ChefSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  specialty_cuisines: [{ type: String, enum: ['Indian', 'Italian', 'Mexican', 'Chinese', 'Other'] }],
  type_of_meals: [{ type: String, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'] }],
  cooking_experience: { type: String, enum: ['Less than 1 year', '1-3 years', '3-5 years', '5+ years'] },
  max_orders_per_day: { type: Number },
  preferred_working_days: [{ type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }],
  preferred_start_time: { type: String },
  preferred_end_time: { type: String },
  created_at: { type: Date, default: Date.now }
});

export const Chef = mongoose.model('Chef', ChefSchema);
