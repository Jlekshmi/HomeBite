import mongoose from "mongoose";

const RiderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  vehicle_type: { type: String, enum: ['Bike', 'Scooter', 'Motorcycle', 'Car', 'Other'], required: true },
  vehicle_registration_number: { type: String, required: true },
  vehicle_insurance_number: { type: String },
  insurance_expiry_date: { type: Date },
  driver_license_number: { type: String, required: true },
  license_expiry_date: { type: Date },
  // document_upload_path: { type: String },
  preferred_delivery_radius: { type: String, enum: ['5 km', '10 km', '15 km', '20+ km'], default: '5 km' },
  preferred_working_days: [{ type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }],
  preferred_start_time: { type: String },
  preferred_end_time: { type: String },
  long_distance_preference: { type: Boolean, default: false }
});

export const Rider = mongoose.model('Rider', RiderSchema);
