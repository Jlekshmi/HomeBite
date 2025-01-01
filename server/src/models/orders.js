import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  order_no:{ type: Number, required: true },
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chef_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef', required: true },
  rider_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Rider' },
  total_amount: { type: Number, required: true },
  status: { type: String, enum: ['Pending','Waiting Pickup', 'In Progress', 'Completed', 'Cancelled'], default: 'pending' },
  created_at: { type: Date, default: Date.now },
  

});

export const Order = mongoose.model('Order', OrderSchema);
