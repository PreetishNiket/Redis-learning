import Redis from "ioredis";
import express from "express";

const app = express();

app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

function otpkey(phone) {
  return `otp:${phone}`;
}

app.post("/otp", async (req, res) => {
  const { phone } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await redis.set(otpkey(phone), otp, "EX", 30);

  res.json({
    message: "OTP sent to the registered phone number",
    otp,
  });
});

app.post("/otp/verify", async (req, res) => {
  const { phone, otp } = req.body;

  const savedOtp = await redis.get(otpkey(phone));

  if (!savedOtp) {
    res.status(400).json({
      message: "OTP has expired , request a OTP again",
    });
  }

  if (savedOtp !== otp) {
    res.status(400).json({
      message: "Invalid OTP . Please enter a valid otp!!",
    });
  }
  //otp verified
  await redis.del(otpkey(phone));
  res.json({
    message: "OTP has verified successfully",
  });
});

app.get("/otp/:phone/ttl", async (req, res) => {
  const ttl = await redis.ttl(otpkey(req.params.phone));

  res.json({
    time_to_live: ttl,
  });
});

app.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});
