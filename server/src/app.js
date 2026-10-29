
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const prisma = require("./db");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    application: "BARMAN"
  });
});

app.get("/api/health/database", async (req, res) => {
  try {
    await prisma.$connect();

    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "ok",
      database: "connected"
    });
  } catch (error) {
    console.error("Database health check failed:", error.message);

    res.status(503).json({
      status: "error",
      database: "disconnected"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`BARMAN API running on port ${PORT}`);
});
