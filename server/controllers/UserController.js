import User from "../models/userModel.js";

export const getUserDetails = async (req, res) => {
  try {
    const userId = req.user?.userId; // fixed key from JWT payload
    if (!userId) {
      return res.status(400).json({ message: "User ID not provided" });
    }

    const user = await User.findById(userId).select("-password"); // don’t send password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
