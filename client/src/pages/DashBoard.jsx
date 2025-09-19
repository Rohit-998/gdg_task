import { useEffect, useState } from "react";

import BookCard from "../components/BookCard";
import { deleteBook, getBooks, updateBook } from "../../lib/apiClient";

export default function Dashboard() {
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    try {
      const res = await getBooks();
      setBooks(res.data.books || []);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

const handleDelete = async (id) => {
  console.log("Deleting book:", id);
  if (!window.confirm("Delete this book?")) return;
  try {
    await deleteBook(id);
    fetchBooks();
  } catch (err) {
    console.error("Delete error:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Failed to delete book!");
  }
};
const handleUpdate = async (book) => {
  // Ask user for new values
  const newTitle = prompt("Enter new title:", book.title);
  const newAuthor = prompt("Enter new author:", book.author);
  const newGenre = prompt("Enter new genre:", book.genre);
  const newPages = prompt("Enter new pages:", book.pages);
  const newAvailable = confirm("Is this book available? OK=Yes, Cancel=No");

  if (!newTitle || !newAuthor || !newGenre) return;

  try {
    await updateBook(book._id, {
      ...book,
      title: newTitle,
      author: newAuthor,
      genre: newGenre,
      pages: Number(newPages),
      available: newAvailable,
    });

    fetchBooks(); 
  } catch (err) {
    alert("Failed to update book!");
    console.error(err);
  }
};


  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {books.map((book) => (
          <BookCard
            key={book._id}
            book={book}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    </div>
  );
}
