// Use ES module import syntax
import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from '../graphql/schemas/schema.js'; // Import GraphQL schema
import resolvers from '../graphql/resolvers/resolvers.js'; // Import GraphQL resolvers
import path from 'path';
import { Payment } from './models/payments.js';
import { Order } from './models/orders.js';

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON payloads
app.use('/uploads', express.static(path.resolve('uploads')));
// Your other routes and logic will go here...
app.get("/", (req, res) => {
  res.send("Backend is running");
});
// Connect to MongoDB  
mongoose.connect('mongodb+srv://HomeBite:Homebite123@homebite.1dasn.mongodb.net/HomeBite?retryWrites=true&w=majority', {

  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // Adjust the timeout duration
  socketTimeoutMS: 45000,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve('uploads')); // Store images in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Create a unique filename
  }
});
  
  const upload = multer({ storage });
  // Upload endpoint for handling image uploads
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Construct image URL based on server setup
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ imageUrl }); // Return the image URL as JSON
});
// Set up Apollo Server
async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // Optionally add authentication logic here
      const token = req.headers.authorization?.split(" ")[1] || "";
      let user = null;
      if (token) {
        try {
          user = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
          console.error("Invalid token", err);
        }
      }
      return { user };
    },
  });
  
  await server.start();
  server.applyMiddleware({ app }); 

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
}
startApolloServer();

app.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_SECRET_KEY
      );

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
      // Find the payment and update the status to successful
      await Payment.findOneAndUpdate(
        { transaction_id: session.id },
        { payment_status: 'successful', payment_date: new Date() }
      );
        // Update order status to "In Progress" or "Completed"
        const order = await Order.findOne({ order_no: session.client_reference_id });
        if (order) {
          order.status = 'In Progress'; // Update as needed
          await order.save();
        }
      }

      res.json({ received: true });
    } catch (err) {
      console.error('Webhook Error:', err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);