import Redis from "ioredis";
import express from "express";

const app = express();

app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const BANNER_KEY = "app:banner";

app.post("/banner", async (req, res) => {
  await redis.set(BANNER_KEY, req.body.message || "No Banner added");

  res.json({
    success: true,
  });
});

app.get("/getBanner", async (req, res) => {
  const response = await redis.get(BANNER_KEY);
  res.json({
    bannerValue: response,
  });
});

app.delete("/banner/delete", async (req, res) => {
  await redis.del(BANNER_KEY);
  res.json({
    success: true,
  });
});

app.get("/banner/exists", async (req, res) => {
  const existanceResponse = await redis.exists(BANNER_KEY);
  res.json({
    // exists: !!existanceResponse,
    exists: Boolean(existanceResponse),
  });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
