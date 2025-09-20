import { Router } from "express";

import {
  getAllBooks,
  addBook,
  updateBook,
  deleteBook,
  getBookAnalytics,
  filterBooks,
  sortBooks,
  paginateBooks,
  getBooksExtendedQuery,
  borrowBook,
  returnBook,
} from "../controllers/BookController.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { verifyToken } from "../middleware/verifyToken.js";
import generalLimiter from "../config/rateLimiter.js";
const bookRouter = Router();
bookRouter.use(
  generalLimiter(
    15 * 60 * 1000, 
    100, 
    "Too many requests, please slow down."
  )
);

bookRouter.get("/", verifyToken, getAllBooks);
bookRouter.post("/addbook", verifyToken, addBook);
bookRouter.put("/updatebook/:id", verifyToken, isAdmin, updateBook);
bookRouter.delete("/deletebook/:id", verifyToken, isAdmin, deleteBook);
bookRouter.get("/analytics", verifyToken, isAdmin, getBookAnalytics);
bookRouter.get("/extended-query", verifyToken, getBooksExtendedQuery);
bookRouter.get("/filter", verifyToken, filterBooks);
bookRouter.get("/sort", verifyToken, sortBooks);
bookRouter.get("/paginate", verifyToken, paginateBooks);
bookRouter.post("/borrow/:id", verifyToken, borrowBook);
bookRouter.post("/return/:id", verifyToken, returnBook);

export default bookRouter;
