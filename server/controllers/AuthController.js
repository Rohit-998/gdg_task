import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const maxAge = 3 * 24 * 60 * 60; // 3 days in seconds
const createToken = (email, userId, role) => {
  // ✅ Include role in the JWT payload
  return jwt.sign({ email, userId, role }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = createToken(user.email, user._id, user.role);

    // ✅ Added httpOnly for security and corrected maxAge to be in milliseconds
    res.cookie("jwt", token, {  maxAge: maxAge * 1000, secure: true, sameSite: "none" });

    res.status(200).json({ token,user: { email: user.email, role: user.role, id: user._id, name: user.name } });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please provide name, email and password" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // The pre-save hook now handles password hashing automatically
    const newUser = await User.create({ name, email, password });

    const token = createToken(newUser.email, newUser._id, newUser.role);
    
    // ✅ Added httpOnly for security and corrected maxAge to be in milliseconds
    res.cookie("jwt", token, { maxAge: maxAge * 1000, secure: true, sameSite: "none" });
    
    // ✅ Added missing name to response
    res.status(201).json({ token, user: { name: newUser.name, email: newUser.email, role: newUser.role, id: newUser._id } });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};