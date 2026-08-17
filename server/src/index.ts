import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import reportRoutes from "./routes/reports.js";
import authorityRoutes from "./routes/authorities.js";
import uploadRoutes from "./routes/upload.js";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

async function start() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");

    app.get("/api/health", (req, res) => {
      res.json({ status: "ok" });
    });

    app.use("/api/auth", authRoutes);
    app.use("/api/reports", reportRoutes);
    app.use("/api/authorities", authorityRoutes);
    app.use("/api/upload", uploadRoutes);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to database:", err);
    console.log("\nPlease check your DATABASE_URL in server/.env");
    console.log("Example: postgresql://postgres:postgres@localhost:5432/civicres?schema=public");
    process.exit(1);
  }
}

start();
