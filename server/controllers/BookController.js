import redis from "../config/redisClient.js";
import Book from "../models/bookModel.js";

export const getAllBooks = async (req, res) => {
  try {
    const { search, page = 1, limit = 9, sortBy, order } = req.query;
    const cacheKey = `books_all_${search || "all"}_${page}_${limit}_${sortBy || "title"}_${order || "asc"}`;
    
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    const query = {};
    if (search) query.title = { $regex: search, $options: "i" };
    
    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = order === "desc" ? -1 : 1;
    } else {
      sortOptions.createdAt = -1;
    }
    
    const books = await Book.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('borrowedBy', 'name')
      .exec();
      
    const count = await Book.countDocuments(query);
    
    const response = {
      books,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalBooks: count,
    };
    
    await redis.set(cacheKey, JSON.stringify(response), "EX", 300);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addBook = async (req, res) => {
  const { title, author, publishedDate, isbn, pages, genre } = req.body;
  if (!title || !author || !publishedDate || !isbn || !pages || !genre) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const existingBook = await Book.findOne({ isbn });
  if (existingBook) {
    return res.status(400).json({ message: "Book with this ISBN already exists" });
  }
  try {
    const newBook = await Book.create({ title, author, publishedDate, isbn, pages, genre });
    await redis.flushall();
    res.status(201).json({ message: "Book added successfully", book: newBook });
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, publishedDate, isbn, pages, genre, available } = req.body;
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { title, author, publishedDate, isbn, pages, genre, available },
      { new: true }
    );
    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    await redis.flushall();
    res.status(200).json({ message: "Book updated successfully", book: updatedBook });
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    await redis.flushall();
    res.status(200).json({ message: "Book deleted successfully", book: deletedBook });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const borrowBook = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (!book.available) {
      return res.status(400).json({ message: "Book is currently unavailable" });
    }
    book.available = false;
    book.borrowedBy = userId;
    await book.save();
    await redis.flushall();
    res.status(200).json({ message: "Book borrowed successfully", book });
  } catch (error) {
    console.error("Error borrowing book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const returnBook = async (req, res) => {
  const { id } = req.params;
  const { userId, role } = req.user;
  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (book.available) {
      return res.status(400).json({ message: "This book is already available." });
    }
    if (role !== 'Admin' && (!book.borrowedBy || book.borrowedBy.toString() !== userId)) {
      return res.status(403).json({ message: "You cannot return this book." });
    }
    book.available = true;
    book.borrowedBy = null;
    await book.save();
    await redis.flushall();
    res.status(200).json({ message: "Book returned successfully", book });
  } catch (error) {
    console.error("Error returning book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBookAnalytics = async (req, res) => {
  try {
    const cacheKey = "books_analytics";
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }
    const totalBooks = await Book.countDocuments();
    const availableBooks = await Book.countDocuments({ available: true });
    const borrowedBooks = totalBooks - availableBooks;
    const genres = await Book.aggregate([
      { $group: { _id: "$genre", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const response = { totalBooks, availableBooks, borrowedBooks, genres };
    await redis.set(cacheKey, JSON.stringify(response), "EX", 300);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error in analytics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};