import rateLimit from "express-rate-limit";

const generalLimiter = (time, max, message) => rateLimit({
  windowMs: time,
  max: max,
  message: {
    status: 429,
    message: message
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default generalLimiter;