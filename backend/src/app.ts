import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env";
import authRoutes from "./modules/auth/auth.routes";
import { notFoundHandler, errorHandler } from "./middleware/error.middleware";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientOrigin }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "nuzu-backend" });
});

app.use("/api/auth", authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);