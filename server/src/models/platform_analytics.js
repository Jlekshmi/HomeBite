import mongoose from "mongoose";

const PlatformAnalyticsSchema = new mongoose.Schema({
  analytics_id: { type: Number, required: true, unique: true },
  total_orders: { type: Number },
  total_transactions: { type: Number },
  top_rated_chef: { type: Number, ref: 'Chef' },
  created_at: { type: Date, default: Date.now }
});

export const PlatformAnalytics = mongoose.model('PlatformAnalytics', PlatformAnalyticsSchema);
