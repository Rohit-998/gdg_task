import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const maxAge = 3 * 24 * 60 * 60;
const createToken = (email, userId, role) => {
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
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000, secure: process.env.NODE_ENV === 'production', sameSite: "none" });
    res.status(200).json({ user: { email: user.email, role: user.role, id: user._id, name: user.name } });
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
    const newUser = await User.create({ name, email, password });
    const token = createToken(newUser.email, newUser._id, newUser.role);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000, secure: process.env.NODE_ENV === 'production', sameSite: "none" });
    res.status(201).json({ user: { name: newUser.name, email: newUser.email, role: newUser.role, id: newUser._id } });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { httpOnly: true, maxAge: 1 });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};