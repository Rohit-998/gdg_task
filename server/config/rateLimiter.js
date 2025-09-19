import rateLimit from "express-rate-limit";

// General limiter (applies to all routes)
const generalLimiter = (time, max,message) => rateLimit({
  windowMs: time,
  max: max,
  message: {
    status: 429,
    message: message
  }
});

// Apply to all requests

export default generalLimiter;