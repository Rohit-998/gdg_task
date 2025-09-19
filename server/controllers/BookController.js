import redis from "../config/redisClient.js";
import Book from "../models/bookModel.js";


// -------------------- Get All Books --------------------
export const getAllBooks = async (req, res) => {
  try {
    const { category, author, search, page = 1, limit = 10 } = req.query;

    // 🔑 Unique cache key for query + pagination
    const cacheKey = `books_all_${category || "all"}_${author || "all"}_${search || "all"}_${page}_${limit}`;

    // 1) Check cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    // 2) DB query
    const query = {};
    if (category) query.category = category;
    if (author) query.author = author;
    if (search) query.title = { $regex: search, $options: "i" };

    const books = await Book.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Book.countDocuments(query);

    const response = {
      books,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalBooks: count,
    };

    // 3) Save in cache (10 min)
    await redis.set(cacheKey, JSON.stringify(response), "EX", 600);

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// -------------------- Add Book --------------------
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

    // ❌ Invalidate cache
    await redis.flushall();

    res.status(201).json({ message: "Book added successfully", book: newBook });
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// -------------------- Update Book --------------------
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

    // ❌ Invalidate cache
    await redis.flushall();

    res.status(200).json({ message: "Book updated successfully", book: updatedBook });
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// -------------------- Delete Book --------------------
export const deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    // ❌ Invalidate cache
    await redis.flushall();

    res.status(200).json({ message: "Book deleted successfully", book: deletedBook });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// -------------------- Analytics --------------------
export const getBookAnalytics = async (req, res) => {
  try {
    const cacheKey = "books_analytics";

    // 1) Check cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    // 2) Compute analytics
    const totalBooks = await Book.countDocuments();
    const availableBooks = await Book.countDocuments({ available: true });
    const borrowedBooks = totalBooks - availableBooks;

    const genres = await Book.aggregate([
      { $group: { _id: "$genre", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const response = { totalBooks, availableBooks, borrowedBooks, genres };

    // 3) Cache for 5 minutes
    await redis.set(cacheKey, JSON.stringify(response), "EX", 300);

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in analytics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// -------------------- Extended Query --------------------
export const getBooksExtendedQuery = async (req, res) => {
  try {
    const { title, author, genre } = req.query;
    const cacheKey = `extended_${title || "all"}_${author || "all"}_${genre || "all"}`;

    // 1) Check cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    // 2) DB query
    const query = {};
    if (title) query.title = { $regex: title, $options: "i" };
    if (author) query.author = { $regex: author, $options: "i" };
    if (genre) query.genre = genre;

    const books = await Book.find(query);
    const response = { total: books.length, books };

    // 3) Save to cache (10 min)
    await redis.set(cacheKey, JSON.stringify(response), "EX", 600);

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in extended query:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// -------------------- Filter --------------------
export const filterBooks = async (req, res) => {
  try {
    const { minPages, maxPages, available } = req.query;
    const cacheKey = `filter_${minPages || "any"}_${maxPages || "any"}_${available || "any"}`;

    // Check cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    const query = {};
    if (minPages || maxPages) {
      query.pages = {};
      if (minPages) query.pages.$gte = parseInt(minPages);
      if (maxPages) query.pages.$lte = parseInt(maxPages);
    }
    if (available) query.available = available === "true";

    const books = await Book.find(query);
    const response = { total: books.length, books };

    await redis.set(cacheKey, JSON.stringify(response), "EX", 600);

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in filtering:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// -------------------- Sort --------------------
export const sortBooks = async (req, res) => {
  try {
    const { sortBy, order } = req.query;
    const cacheKey = `sort_${sortBy || "none"}_${order || "asc"}`;

    // Check cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    const sort = {};
    if (sortBy) sort[sortBy] = order === "desc" ? -1 : 1;

    const books = await Book.find().sort(sort);
    const response = { total: books.length, books };

    await redis.set(cacheKey, JSON.stringify(response), "EX", 600);

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in sorting:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// -------------------- Pagination --------------------
export const paginateBooks = async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const cacheKey = `paginate_${page}_${limit}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    const totalBooks = await Book.countDocuments();
    const books = await Book.find().skip(skip).limit(limit);

    const response = {
      page,
      limit,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
      books
    };

    await redis.set(cacheKey, JSON.stringify(response), "EX", 600);

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in pagination:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
