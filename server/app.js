import express from "express";
import cors from "cors";
import passport from "passport";
import "./config/passport.js";

import authRoutes from "./routes/auth.js";
import campaignRoutes from "./routes/campaigns.js";
import adminRoutes from "./routes/admin.js";
import blogRoutes from "./routes/blogs.js";
import ecoPointsRoutes from "./routes/ecopoints.js";
import leaderboardRoutes from './routes/leaderboardRoutes.js';


//test route
import certificateRoutes from './routes/certificateRoutes.js';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

// middleware
app.use(cors({
  origin: 'http://localhost:5173', // frontend origin
  credentials: true                // allow cookies/auth
}));
app.use(passport.initialize());

// Serve uploaded images statically
app.use('/uploads', express.static('uploads'));
app.use('/certificates', express.static('public/certificates'));

// Connect to DB
import connectDB from "./config/database.js";
connectDB();

// Routes
app.use("/api/auth", express.json(), authRoutes);
app.get("/api/test", (req, res) => {
  res.send("EcoWise backend is running 🚀");
});
app.use("/api/campaigns", express.json(), campaignRoutes);
app.use("/api/admin", express.json(), adminRoutes);
app.use("/api/blogs", express.json(), blogRoutes);
app.use("/api/ecopoints", express.json(), ecoPointsRoutes);
app.use("/api/waste", express.json(), wasteRoutes);
app.use('/api/leaderboard', express.json(), leaderboardRoutes);



// Test route
app.use('/api/certificates', certificateRoutes);
app.use('/certificates', express.static('public/certificates'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Express error:", err);
  res.status(500).json({ message: "Server Error", error: err?.message || err });
});

export default app;
