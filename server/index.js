import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import setupAdmin from "./models/setUpAdmin.js";
import authRouter from "./routes/AuthRoutes.js";
import bookRouter from "./routes/BookRouter.js";
import userRouter from "./routes/UserRoutes.js";
import generalLimiter from "./config/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
app.set("trust proxy", 1);

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    setupAdmin();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(generalLimiter(15 * 60 * 1000, 200, "Too many requests, please try again later."));
app.use("/api/auth", authRouter);
app.use("/api/books", bookRouter);
app.use("/api/users", userRouter);

app.get("/", (req, res) => {
  res.send("Library Management System API is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});