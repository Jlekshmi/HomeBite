import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  payment_method: { type: String, enum: ['COD','credit_card', 'debit_card', 'paypal', 'net_banking'], required: true },
  transaction_id: { type: String, unique: true },
  amount: { type: Number, required: true },
  payment_status: { type: String, enum: ['successful', 'failed', 'pending'], default: 'pending' },
  payment_date: { type: Date, default: Date.now }
});

export const Payment = mongoose.model('Payment', PaymentSchema);