import Redis from "ioredis";
import express from "express";
import mongoose from "mongoose";

const app = express();

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/mongo-db";

app.get("/redis", async (req, res) => {
  try {
    const reply = await redis.ping();

    res.json({
      redis: reply,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/mongo", async (req, res) => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUrl);
    }

    res.json({
      mongo: "Connected",
      database: mongoose.connection.name,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
