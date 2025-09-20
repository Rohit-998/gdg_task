import { useEffect, useState } from "react";
import { toast } from "sonner";
import BookCard from "../components/BookCard";

import { getBooks, getDashboardBooks, returnBook, deleteBook, updateBook } from "../../lib/apiClient";
import useIsAdmin from "../components/AdminOnly";

export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isAdmin = useIsAdmin();

  const fetchData = async () => {
    if (isAdmin === undefined) return;
    setIsLoading(true);
    try {
      const res = isAdmin ? await getBooks() : await getDashboardBooks();
      setBooks(res.data.books || []);
    } catch (err) {
      console.error("Error fetching books:", err);
      toast.error("Could not fetch books.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAdmin]);

  const handleReturn = async (bookId) => {
    if (!window.confirm("Are you sure you want to return this book?")) return;
    try {
      await returnBook(bookId);
      toast.success("Book returned successfully!");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to return book.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this book?")) return;
    try {
      await deleteBook(id);
      toast.success("Book deleted successfully!");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete book.");
    }
  };

  const handleUpdate = async (book) => {
    const newTitle = prompt("Enter new title:", book.title);
    if (!newTitle) return;
    const newAuthor = prompt("Enter new author:", book.author);
    if (!newAuthor) return;
    try {
      await updateBook(book._id, {
        ...book,
        title: newTitle,
        author: newAuthor,
      });
      toast.success("Book updated successfully!");
      fetchData();
    } catch (err) {
      toast.error("Failed to update book!");
      console.error(err);
    }
  };

  if (isLoading || isAdmin === undefined) {
    return <p className="text-center text-lg">Loading Dashboard...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        {isAdmin ? "Admin Dashboard (All Books)" : "My Borrowed Books"}
      </h1>

      {books.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onReturn={handleReturn}
              onDelete={isAdmin ? handleDelete : null}
              onUpdate={isAdmin ? handleUpdate : null}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 py-10">
          {isAdmin ? "There are no books in the library." : "You haven't borrowed any books yet."}
        </p>
      )}
    </div>
  );
}