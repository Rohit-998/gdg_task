import User from "../models/userModel.js";
import Book from "../models/bookModel.js";

export const getUserDetails = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID not provided" });
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const dashboard = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;

    const query = { borrowedBy: userId };

    const borrowedBooks = await Book.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('borrowedBy', 'name')
      .exec();
      
    const count = await Book.countDocuments(query);

    res.status(200).json({
      message: "Borrowed books fetched successfully",
      books: borrowedBooks,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};