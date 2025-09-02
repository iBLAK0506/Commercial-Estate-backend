import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import { connectMongo } from "./utils/mongo.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import propertyRoutes from "./routes/properties.routes.js";
import chatRoutes from "./routes/chats.routes.js";
import { errorHandler, notFound } from "./utils/error.js";

await connectMongo();

const app = express();

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Rate limiters
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50 });
const apiLimiter = rateLimit({ windowMs: 1 * 60 * 1000, max: 500 });

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", apiLimiter, userRoutes);
app.use("/api/properties", apiLimiter, propertyRoutes);
app.use("/api/chats", apiLimiter, chatRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
