import mongoose from "mongoose";

const PaymentInfoSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
 // preferred_payment_method: { type: String, enum: ['Bank Transfer', 'PayPal', 'Other'], required: true },
  bank_account_number: { type: String },
  transit_number: { type: String },
  //payment_account_verification: { type: Boolean, default: false }
});

export const PaymentInfo = mongoose.model('PaymentInfo', PaymentInfoSchema);