import mongoose from "mongoose";
const DisputeSchema = new mongoose.Schema({
  dispute_id: { type: Number, required: true, unique: true },
  order_id: { type: Number, ref: 'Order', required: true },
  raised_by: { type: Number, ref: 'User', required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['open', 'resolved', 'closed'], required: true },
  resolution: { type: String },
  resolved_by: { type: Number, ref: 'User' },
  created_at: { type: Date, default: Date.now },
  resolved_at: { type: Date }
});

module.exports = mongoose.model('Dispute', DisputeSchema);
