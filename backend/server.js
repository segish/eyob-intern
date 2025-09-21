import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from "cors";
import path from "path";
import fs from "fs"


import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import productRoutes from './routes/product.route.js';
import serviceRoutes from './routes/service.route.js';
import eventRoutes from './routes/event.route.js';
import testimonialRoutes from './routes/testimonial.route.js'
import partnerRoutes from './routes/partner.route.js';
import messageRoutes from './routes/message.route.js';
import settingRoutes from './routes/setting.route.js';
import analyticsRoute from './routes/analytics.route.js';

import { connectDB } from './lib/db.js';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;


const __dirname = path.resolve();


app.use(
  cors({
    origin: process.env.CLIENT_URL, 
    credentials: true,               
  })
);

app.use(express.json({limit:"10mb"}));
app.use(cookieParser());




app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);
app.use("/api/product",productRoutes);
app.use("/api/service",serviceRoutes);
app.use("/api/event",eventRoutes);
app.use("/api/testimonial",testimonialRoutes);
app.use("/api/partner",partnerRoutes);
app.use("/api/message",messageRoutes);
app.use("/api/setting",settingRoutes);
app.use("/api/analytics",analyticsRoute);

const distPath = path.join(__dirname, "admin2", "dist");
const indexHtml = path.join(distPath, "index.html");

app.use(express.static(distPath));

// Middleware to serve React SPA without using "*"
app.use((req, res, next) => {
  // Only handle requests that are NOT API routes
  if (!req.path.startsWith("/api")) {
    if (fs.existsSync(indexHtml)) {
      return res.sendFile(indexHtml);
    } else {
      return res.status(500).send("index.html not found. Build frontend first.");
    }
  }
  next();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB()
});

