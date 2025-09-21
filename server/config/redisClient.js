import Redis from "ioredis";

let redis;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);
} else {
  redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
  });
}

redis.on("connect", () => console.log("Connected to Redis"));
redis.on("error", (err) => console.error(" Redis error:", err));

export default redis;
