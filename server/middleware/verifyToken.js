import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedPayload) => {
    if (err) {
      console.error("JWT verification error:", err);
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
    req.user = decodedPayload; 
    next();
  });
};
